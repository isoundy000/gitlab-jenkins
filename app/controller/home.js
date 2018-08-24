'use strict';

const Controller = require('egg').Controller;
const autoscript = require('../jenkins/autoscript');
const createJenkins = require('../jenkins/createJenkins')
class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async webhook(){
    let message = [];
    const ctx = this.ctx;
    if(await autoscript(ctx.request.query || {},this.config, message) === true){
      message.shift();
    }
    ctx.body = message.join('\n')
  }
  async createJenkins(){
      let message = [];
      const ctx = this.ctx;
      if(await createJenkins(ctx.request.query || {},this.config, message) === true){
          message.shift();
      }
      ctx.body = message.join('\n')
  }
}

module.exports = HomeController;


