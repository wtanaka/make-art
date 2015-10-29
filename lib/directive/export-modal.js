var api,
    app = require('../app'),
    social = require('../core/social'),
    notify = require('../api/notify');

var WALLPAPER_RATIOS = {
        '1024': {
            width  : 1024,
            height : 768
        },
        '4-3': {
            width  : 1600,
            height : 1200
        },
        '16-9': {
            width  : 1920,
            height : 1080
        }
    };

/*
 * Share modal directive
 *
 * Share modal directive under display
 */

app.directive('exportModal', function ($rootScope, $location, $routeParams, emailService) {
    return {
        restrict    : 'E',
        templateUrl : '/directive/export-modal.html',
        scope       : {
            display : '=',
            action  : '='
        },
        link        : function (scope) {

            // Setup api
            api = $rootScope.api;

            // Setup scope
            scope.open = false;
            scope.meta = {};
            $rootScope.successful = false;
            scope.creation = null;

            // Initialise
            init();
            bind();

            function init() {
                var _shareCache;

                // Next tick..
                setTimeout(function () {
                    if (scope.display.workspace && scope.display.workspace.scope._shareCache) {
                        _shareCache = scope.display.workspace.scope._shareCache;
                        scope.meta.title = _shareCache.title;
                        scope.meta.description = _shareCache.description;
                    }
                });

                social.init();
            }

            $rootScope.$watch('shareModal', function (val) {
                if (val) {
                    open();
                }
            });

            /*
             * Submit form
             *
             * @return void
             */
            scope.submit = function () {
                if (!scope.meta.title) {
                    return showError('Please choose a title');
                } else if (scope.meta.title.length > 100) {
                    return showError('Title is too long');
                }

                resetError();
                performAction();
            };

            scope.facebookShare = function (creation) {
                var url = $rootScope.cfg.WORLD_URL + '/shared/' + creation.slug;

                social.share.facebook({
                    title   : creation.title + ' on Make Art',
                    url     : url,
                    picture : creation.cover_url,
                    caption : 'Shared by ' + $rootScope.user.username + ' through Mischief Week',
                    text    : creation.description
                }, function (err, res) {
                    if (err) { return err; }
                });
            };

            scope.sendMail = function (creation) {
                var emailObj;
                if (!creation.name || !creation.email) {
                    return false;
                } else {
                    if (emailService.validate(creation.email)) {
                        creation.user_email = $rootScope.user.email;
                        creation.message = scope.meta.description;
                        creation.world_url = $rootScope.cfg.WORLD_URL + '/shared/' + creation.slug;

                        emailObj = emailService.buildObject(creation);
                        emailService.send(emailObj, function (response) {
                            if (response.status === 200) {
                                emailService.reset(creation);
                                
                                return notify.success();
                            }
                        }, function (error) {
                            if (error) {
                                emailService.reset(creation);

                                return notify.failure();
                            }
                        });
                    } else {
                        return notify.failure();
                    }
                }
            };

            scope.buildTwitterURL = function (creation) {
                var text = creation.title + " by " + $rootScope.user.username + " through Mischief Week on Make Art. ";
                text += "\n" + $rootScope.cfg.WORLD_URL + "/shared/" + creation.slug;

                return "https://twitter.com/intent/tweet?text=" + encodeURI(text);
            };

            scope.closeSocial = function () {
                scope.close();
                $rootScope.successful = true;
            };

            /*
             * Perform modal export action
             *
             * @return void
             */
            function performAction() {
                if (scope.action === 'share') {
                    share();
                } else if (scope.action === 'save') {
                    save();
                }
            }

            /*
             * Show an error message
             *
             * @return void
             */
            function showError(err) {
                scope.error = err;
            }

            /*
             * Remove displayed error message
             *
             * @return void
             */
            function resetError() {
                scope.error = null;
            }

            /*
             * Open modal, load parent display's source and canvas
             *
             * @return void
             */

            function open() {
                scope.meta.title = '';
                scope.meta.description = '';
                scope.open = true;
                scope.source = scope.display.source;
                scope.canvas = scope.display.canvas;
                scope.imageURL = getImageURL();
            }

            /*
             * Close modal
             *
             * @return void
             */
            scope.close = function() {
                scope.open = false;
                $rootScope.shareModal = false;
                scope.display.openModal = null;
            };

            /*
             * Get image data URL
             *
             * @return {String}
             */
            function getImageURL() {
                return scope.canvas.toDataURL('image/png');
            }

            /*
             * Listen to parent display's state changes and DOM events
             *
             * @return void
             */
            function bind() {

                // Open or close on parent display modal state change 
                scope.display.$watch('openModal', function (modalId) {
                    if (modalId === scope.action && !scope.open) {
                        open();
                    } else if (scope.open) {
                        scope.close();
                    }
                });

                // Reset error on title change
                scope.$watch('title', function () {
                    resetError();
                });

                // Listen for keydown events, close when ESC is pressed
                window.addEventListener('keydown', function (e) {
                    if (e.keyCode === 27) { // ESC
                        scope.display.setOpenModal(null);
                        scope.close();
                        scope.$apply();
                    }
                });

            }

            /*
             * Share creation on Kano World
             *
             * @return void
             */
            function share() {
                var title = scope.meta.title || '',
                    code = scope.display.source,
                    description = scope.meta.description || '',
                    challengeId = $routeParams.id,
                    world = $routeParams.world;

                if (!$rootScope.loggedIn) {

                    // Store current details and prompt login if not currently logged in
                    var options = {
                        title       : title,
                        code        : code,
                        description : description,
                        challengeId : challengeId
                    };

                    localStorage._shareCache = JSON.stringify(options);

                    api.auth.login();
                    return;
                }

                api.progress.trackLinesOfCode(code.split('\n').length);
                
                api.challengeIO.share(title, code, description, scope.imageURL, world, challengeId, function (data) {
                    if (data) {
                        scope.creation = data.body.item;
                        scope.$apply();
                    }
                });
            }

            /*
             * Save creation locally
             *
             * @return void
             */
            function save() {
                api.challengeIO.save(
                    scope.meta.title,
                    scope.display.source,
                    scope.meta.description,
                    getImageURL()
                    );

                scope.close();
            }

            /*
             * Export images
             *
             * @return void
             */
            scope.exportWallpaper = function() {
                var wallpapers = getWallpapers();

                api.challengeIO.saveWallpaper(
                    scope.meta.title,
                    wallpapers['1024'],
                    wallpapers['4-3'],
                    wallpapers['16-9']);

                scope.close();
            };

            /*
             * Generate wallpapers from current canvas
             *
             * @return void
             */
            function getWallpapers() {
                var canvas = scope.display.canvas;

                var original = {
                        width  : canvas.width,
                        height : canvas.height
                    },
                    tempCanvas = document.createElement('canvas'),
                    tempCtx = tempCanvas.getContext('2d'),
                    wallpapers = {};

                var setCanvas = function(size) {
                    var scaleFactor = Math.min(
                            size.width / original.width,
                            size.height / original.height
                        ),
                        offset = {
                            x : (size.width / scaleFactor - original.width) / 2,
                            y : (size.height / scaleFactor - original.height) / 2
                        };

                    tempCanvas.width = size.width;
                    tempCanvas.height = size.height;

                    tempCtx.scale(scaleFactor, scaleFactor);

                    // toDataURL() retains alpha, so paint a white bg
                    tempCtx.rect(0, 0, size.width, size.height);
                    tempCtx.fillStyle = 'white';
                    tempCtx.fill();

                    tempCtx.drawImage(canvas, offset.x, offset.y);
                };

                for (var ratio in WALLPAPER_RATIOS) {
                    if (WALLPAPER_RATIOS.hasOwnProperty(ratio)) {
                        setCanvas(WALLPAPER_RATIOS[ratio]);
                        wallpapers[ratio] = tempCanvas.toDataURL('image/png');
                    }
                }

                return wallpapers;
            }
        }
    };
});
