﻿angular
    .module('dpApp.ctrl.projects', ['ngTable'])
    .controller('projectsCtrl', [
        '$scope',
        '$timeout',
        '$location',
        '$modal',
        'projectService',
        'ngTableParams',
        function ($scope, $timeout, $location, $modal, projectService, ngTableParams) {

            $scope.forms = {};

            $scope.editProject = function (projectId) {
                var modalInstance = $modal.open({
                    templateUrl: '/Dp/Project',
                    controller: 'projectCtrl',
                    scope: $scope,
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    $scope.tableParams.reload();
                });

            };

            $scope.assignProject = function (projectId) {
                var modalInstance = $modal.open({
                    templateUrl: '/Dp/Students',
                    controller: 'studentsCtrl',
                    scope: $scope,
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $scope.tableParams.reload();
                });

            };
            
            $scope.deleteProject = function (id) {
                bootbox.confirm("Вы действительно хотите удалить проект?", function (isConfirmed) {
                    if (isConfirmed) {
                        projectService.deleteproject(id).success(function () {
                            $scope.tableParams.reload();
                            alertify.success("Проект успешно удален.");
                        }).error(function(error) {
                            alertify.error(error);
                        });
                    }
                });
            };
            
            $scope.deleteAssignment = function (id) {
                bootbox.confirm("Вы действительно хотите удалить назначение дипломного проекта?", function (isConfirmed) {
                    if (isConfirmed) {
                        projectService.deleteAssignment(id).success(function () {
                            $scope.tableParams.reload();
                            alertify.success("Назначение успешно удалено.");
                        }).error(function(error) {
                            alertify.error(error);
                        });
                    }
                });
            };

            $scope.downloadTaskSheet = function(id) {
                projectService.downloadTaskSheet(id);
            };
            
            $scope.tableParams = new ngTableParams(
                angular.extend({
                    page: 1,
                    count: 10,
                    sorting: {
                        Theme: 'asc'
                    }
                }, $location.search()), {
                    total: 0,
                    getData: function ($defer, params) {
                        $location.search(params.url());
                        projectService.getProjects(params.url())//todo
                            .success(function (data) {
                                $defer.resolve(data.Data);
                                params.total(data.Total);
                                $scope.navigationManager.setListPage(params.url());
                            });
                    }
                });

            $scope.navigationManager.setListPage();

        }]);