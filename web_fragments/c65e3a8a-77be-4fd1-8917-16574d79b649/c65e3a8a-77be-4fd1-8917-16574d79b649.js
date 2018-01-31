var module;
try {
  module = angular.module('bonitasoft.ui.fragments');
} catch (e) {
  module = angular.module('bonitasoft.ui.fragments', []);
  angular.module('bonitasoft.ui').requires.push('bonitasoft.ui.fragments');
}
module.directive('pbFragmentComments', function() {
  return {
    template: '<div>    <div class="row">\n        <div pb-property-values=\'d05fa73e-47ca-479b-86ce-084675897f20\'>\n\n  <div class="col-xs-12  col-sm-12  col-md-12  col-lg-12"\n       ng-class="properties.cssClasses"\n       ng-if="!properties.hidden"\n>\n\n        <div class="row">\n        <div pb-property-values=\'35abdade-9660-4828-add5-06d6ff8fa9bd\'>\n    <div ng-if="!properties.hidden" class="component col-xs-12  col-sm-12  col-md-12  col-lg-12" ng-class="properties.cssClasses">\n        <pb-title></pb-title>\n    </div>\n</div>\n    </div>\n    <div class="row">\n        <div pb-property-values=\'d24bea59-dd88-4eb9-9497-36b86bdff72c\'>\n    <div ng-if="!properties.hidden" class="component col-xs-12  col-sm-12  col-md-12  col-lg-12" ng-class="properties.cssClasses">\n        <pb-table></pb-table>\n    </div>\n</div>\n    </div>\n\n\n  </div>\n</div>\n\n    </div>\n    <div class="row">\n        <div pb-property-values=\'e1a17440-ab1f-45fd-bcde-264fff9eff2f\'>\n    <div ng-if="!properties.hidden" class="component col-xs-12  col-sm-12  col-md-12  col-lg-12" ng-class="properties.cssClasses">\n        <pb-input></pb-input>\n    </div>\n</div>\n    </div>\n</div>'
  };
});
