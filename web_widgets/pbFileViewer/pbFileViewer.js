(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('pbFileViewer', function() {
    return {
      controllerAs: 'ctrl',
      controller: function WidgetController($scope, $log, $location, $sce) {

  var controller = this;

  $scope.$watch('[properties.document, properties.url]', function() {
    controller.fileName = getFileName();
    controller.loadDocument();
  }, true);

  controller.loadDocument = function() {
    controller.document = null;
    if ($scope.properties.document) {
      if (angular.isArray($scope.properties.document)) {
        $log.error('The documentViewer property named "document" should hold a single document. You might want to use documents[0]');
      } else if (angular.isObject($scope.properties.document) && $scope.properties.document.id) {
        controller.document = $scope.properties.document;
      } else {
        $log.error('The documentViewer property named "document" does not contain a Bonita document and cannot be rendered.');
      }
    }
  };

  controller.isPDF = function() {
    return ['pdf'].indexOf(controller.extractFileExtension(controller.fileName)) > -1;
  };

  controller.isImage = function() {
    return ['png', 'jpg', 'jpeg', 'gif'].indexOf(controller.extractFileExtension(controller.fileName)) > -1;
  };

  controller.getDocumentViewUrl = function() {
    if (isTypeProcessDocument() && controller.document) {
      if (isInitializedByAnExternalSystem(controller.document)) {
        return controller.document.url;
      }
      return '../API/formsDocumentImage?document='+ controller.document.id;
    } else {
      return $scope.properties.url;
    }
  };

  controller.getTrustedDocumentViewUrl = function() {
    return $sce.trustAsResourceUrl(controller.getDocumentViewUrl());
  };

  controller.extractFileExtension = function(file) {
    return file.split('?')[0].split('.').pop().toLowerCase();
  };

  function getFileName() {
    if (isTypeUrl()) {
      return extractFileName($scope.properties.url);
    }
    if (isInitializedByAnExternalSystem($scope.properties.document)) {
      return extractFileName($scope.properties.document.url);
    }
    return $scope.properties.document && $scope.properties.document.fileName;
  }

  function isTypeUrl() {
    return $scope.properties.type === 'URL';
  }

  function isTypeProcessDocument() {
    return  $scope.properties.type === 'Process document';
  }

  function extractFileName(name) {
    return name && name.split('?')[0].split('/').pop();
  }

  function isInitializedByAnExternalSystem(document) {
    // document initialized by an external system has no fileName
    return document && document.fileName == null;
  }
}
,
      template: '<div ng-if="environment">\n  <div>\n    <a href="" class="FileViewer-fileName">{{ \'FileName\' | translate }}</a>\n  </div>\n  <div ng-if="properties.showPreview" class="img-responsive FileViewer-iconPreview"  >\n    <img class="img-responsive"  style="padding-top:10px;margin: auto;" src="data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%2040%2020%27%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20xml%3Aspace%3D%27preserve%27%20style%3D%27fill-rule%3Aevenodd%3Bclip-rule%3Aevenodd%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A1.41421%3B%27%3E%3Cg%3E%3Cpath%20d%3D%27M11.75%2C19.775l-3.283%2C0c-0.52%2C0%20-0.942%2C-0.45%20-0.942%2C-1.005c0%2C-3.396%200%2C-14.415%200%2C-17.81c0%2C-0.555%200.422%2C-1.006%200.942%2C-1.006l8.468%2C0l5.69%2C6.105l0%2C2.841c-2.097%2C0%20-4.055%2C0.595%20-5.717%2C1.624l-6.544%2C0l0%2C1.508l4.628%2C0c-0.452%2C0.445%20-0.864%2C0.93%20-1.233%2C1.447l-3.395%2C0l0%2C1.508l2.496%2C0c-0.093%2C0.188%20-0.18%2C0.379%20-0.262%2C0.573c-0.155%2C0.282%20-0.288%2C0.574%20-0.394%2C0.876l-1.84%2C0l0%2C1.508l1.537%2C0l-0.002%2C0.029c-0.098%2C0.586%20-0.149%2C1.188%20-0.149%2C1.802ZM19.785%2C7.569l-9.421%2C0l0%2C1.508l9.421%2C0l0%2C-1.508ZM21.551%2C6.031l-4.734%2C-5.003c0%2C0%200%2C2.537%200%2C3.997c0%2C0.267%200.1%2C0.523%200.276%2C0.711c0.177%2C0.189%200.417%2C0.295%200.667%2C0.295l3.791%2C0Z%27%20style%3D%27fill%3A%23ccc%3B%27%2F%3E%3Cg%3E%3Cpath%20d%3D%27M16.648%2C16.683l-1.021%2C-1.037c2.211%2C-2.052%205.172%2C-3.307%208.424%2C-3.307c3.252%2C0%206.213%2C1.255%208.424%2C3.307l-1.021%2C1.037c-1.981%2C-1.9%20-4.571%2C-3.051%20-7.403%2C-3.051c-2.832%2C0%20-5.422%2C1.151%20-7.403%2C3.051Z%27%20style%3D%27fill%3A%23ccc%3B%27%2F%3E%3Cpath%20d%3D%27M19.052%2C17.849l-0.259%2C0.43c1.468%2C0.837%203.247%2C1.327%205.163%2C1.327c2%2C0%203.85%2C-0.533%205.353%2C-1.438l-0.255%2C-0.424c-1.456%2C0.815%20-3.21%2C1.29%20-5.098%2C1.29c-1.804%2C0%20-3.487%2C-0.435%20-4.904%2C-1.185Z%27%20style%3D%27fill%3A%23ccc%3B%27%2F%3E%3Cpath%20d%3D%27M24.06%2C12.353c1.587%2C0%202.876%2C1.289%202.876%2C2.876c0%2C1.587%20-1.289%2C2.876%20-2.876%2C2.876c-1.588%2C0%20-2.877%2C-1.289%20-2.877%2C-2.876c0%2C-1.587%201.289%2C-2.876%202.877%2C-2.876ZM25.244%2C14.174c0.582%2C0%201.055%2C0.473%201.055%2C1.055c0%2C0.582%20-0.473%2C1.055%20-1.055%2C1.055c-0.582%2C0%20-1.054%2C-0.473%20-1.054%2C-1.055c0%2C-0.582%200.472%2C-1.055%201.054%2C-1.055Z%27%20style%3D%27fill%3A%23ccc%3B%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="{{ \'File viewer icon\' | uiTranslate }}"/>\n  </div>\n</div>\n\n<div ng-if="!environment && ctrl.fileName">\n  <a class="FileViewer-fileName"\n     title="{{\'View\' | uiTranslate}} {{ ctrl.fileName || ctrl.getDocumentViewUrl() }}"\n     ng-if="ctrl.isImage() || ctrl.isPDF()"\n     ng-href="{{ctrl.getTrustedDocumentViewUrl()}}"\n     box-viewer>\n      {{ ctrl.fileName || ctrl.getDocumentViewUrl() }}\n  </a>\n  <a class="FileViewer-fileName"\n     title="{{\'Download\' | uiTranslate}} {{ ctrl.fileName || ctrl.getDocumentViewUrl() }}"\n     ng-if="!ctrl.isImage() && !ctrl.isPDF()"\n     ng-href="{{ctrl.getDocumentViewUrl()}}">\n      {{ ctrl.fileName || ctrl.getDocumentViewUrl() }}\n  </a>\n\n  <div ng-if="properties.showPreview && ctrl.isPDF()">\n    <iframe ng-src="{{ctrl.getTrustedDocumentViewUrl()}}" frameborder="0" class="document-iframe"></iframe>\n  </div>\n\n  <div ng-if="properties.showPreview && ctrl.isImage()">\n    <a title="{{ ctrl.fileName || ctrl.getDocumentViewUrl() }}"\n       box-viewer\n       ng-href="{{ctrl.getTrustedDocumentViewUrl()}}">\n      <img ng-src="{{ctrl.getTrustedDocumentViewUrl()}}"\n           alt="{{ \'File unavailable\' | translate }}"\n           class="FileViewer-img img-responsive"/>\n    </a>\n  </div>\n\n  <div ng-if="properties.showPreview && (!ctrl.isImage() && !ctrl.isPDF())">\n    <span class="FileViewer-previewNotAvailable" ui-translate>Preview is not available</span>\n  </div>\n</div>\n'
    };
  });
