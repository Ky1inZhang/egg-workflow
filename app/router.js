'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/all', controller.home.all);
  router.get('/find/:name', controller.home.find);
  router.get('/add/:name', controller.home.add);
  router.get('/update/:id', controller.home.update);
  router.get('/cost/:id', controller.home.cost);
  router.get('/items/:name', controller.home.items);

};
