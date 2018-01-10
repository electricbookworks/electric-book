// set up elasticlunr
var index = elasticlunr(function () {
    this.addField('title');
    this.addField('content');
});
