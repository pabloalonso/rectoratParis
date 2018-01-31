package fr.edu.paris.gdd;

import groovy.json.JsonBuilder

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import org.apache.http.HttpHeaders
import org.bonitasoft.engine.api.ProcessAPI
import org.bonitasoft.engine.bpm.process.ProcessInstanceNotFoundException
import org.bonitasoft.engine.expression.Expression
import org.bonitasoft.engine.expression.ExpressionBuilder
import org.bonitasoft.web.extension.ResourceProvider
import org.bonitasoft.web.extension.rest.RestApiResponse
import org.bonitasoft.web.extension.rest.RestApiResponseBuilder
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import com.bonitasoft.web.extension.rest.RestAPIContext
import com.bonitasoft.web.extension.rest.RestApiController

class Index implements RestApiController {

    private static final Logger LOGGER = LoggerFactory.getLogger(Index.class)

    @Override
    RestApiResponse doHandle(HttpServletRequest request, RestApiResponseBuilder responseBuilder, RestAPIContext context) {
		try{
        // To retrieve query parameters use the request.getParameter(..) method.
        // Be careful, parameter values are always returned as String values

        // Retrieve caseId parameter
			def caseId = request.getParameter "caseId"
			if (caseId == null) {
				return buildResponse(responseBuilder, HttpServletResponse.SC_BAD_REQUEST,"""{"error" : "the parameter caseId is missing"}""")
			}

			ProcessAPI pAPI = context.getApiClient().getProcessAPI();
			try {
				pAPI.getProcessInstance(new Long(caseId))
			}catch(ProcessInstanceNotFoundException pi) {	
				return buildResponse(responseBuilder, HttpServletResponse.SC_BAD_REQUEST,"""{"error" : "The case is not correct"}""")
			}
			
        // Here is an example of how you can retrieve configuration parameters from a properties file
        // It is safe to remove this if no configuration is required
			Properties props = loadProperties("configuration.properties", context.resourceProvider)
			String message = props["message"]
			String processus = props["processus"]
			String recepteur = props["recepteur"]
			String cle = props["cle"]

			
			Expression targetProcess = new ExpressionBuilder().createConstantStringExpression(processus);
			Expression targetFlowNode = new ExpressionBuilder().createConstantStringExpression(recepteur);
		
			Map<Expression,Expression> messageCorrelation = new HashMap<Expression,Expression>();
			Expression varName = new ExpressionBuilder().createConstantStringExpression(cle);
			Expression varValue = new ExpressionBuilder().createConstantStringExpression(caseId);
			
			messageCorrelation.put(varName, varValue);	
		
			
			pAPI.sendMessage(message, targetProcess, targetFlowNode, null,  messageCorrelation)
			return buildResponse(responseBuilder, HttpServletResponse.SC_OK,"""{"status" :"Demande supprimed" }""")
		} catch(Exception e){
			LOGGER.error(e.getMessage());
			return buildResponse(responseBuilder, HttpServletResponse.SC_SERVICE_UNAVAILABLE,"""{"error" :"""+e.getMessage()+"}")
		}		
		
        
    }

    /**
     * Build an HTTP response.
     *
     * @param  responseBuilder the Rest API response builder
     * @param  httpStatus the status of the response
     * @param  body the response body
     * @return a RestAPIResponse
     */
    RestApiResponse buildResponse(RestApiResponseBuilder responseBuilder, int httpStatus, Serializable body) {
        return responseBuilder.with {
            withResponseStatus(httpStatus)
            withResponse(body)
            build()
        }
    }

    /**
     * Returns a paged result like Bonita BPM REST APIs.
     * Build a response with a content-range.
     *
     * @param  responseBuilder the Rest API response builder
     * @param  body the response body
     * @param  p the page index
     * @param  c the number of result per page
     * @param  total the total number of results
     * @return a RestAPIResponse
     */
    RestApiResponse buildPagedResponse(RestApiResponseBuilder responseBuilder, Serializable body, int p, int c, long total) {
        return responseBuilder.with {
            withContentRange(p,c,total)
            withResponse(body)
            build()
        }
    }

    /**
     * Load a property file into a java.util.Properties
     */
    Properties loadProperties(String fileName, ResourceProvider resourceProvider) {
        Properties props = new Properties()
        resourceProvider.getResourceAsStream(fileName).withStream { InputStream s ->
            props.load s
        }
        props
    }

}
