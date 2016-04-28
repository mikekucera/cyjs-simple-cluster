;(function(){ 'use strict';

  var defaults = {
    darts: 4
  };

  // registers the extension on a cytoscape lib ref
  var register = function(cytoscape, $) {
    if( !cytoscape ){ return; } // can't register if cytoscape unspecified

    cytoscape( 'core', 'cyjsSimpleCluster', function(parameters) {
      var cy = this;
      var options = $.extend(true, {}, defaults, parameters);

      // your extension impl...
      console.log("cyjsSimpleCluster: " + JSON.stringify(options));



      var nodes = cy.collection('node');
      var bounds = nodes.boundingBox();
      console.log("nodes: " + nodes.map( function(n){ return n.id() } ));
      console.log("extent: " + JSON.stringify(bounds));

      var darts = [];
      for(var i = 0; i < options.darts; i++) {
        darts.push({
          id: i,
          x: (Math.random() * bounds.w) + bounds.x1,
          y: (Math.random() * bounds.h) + bounds.y1,
          cluster: []
        });
      }

      function distance(dart, node) {
        return Math.sqrt(Math.pow(dart.x - node.position('x'), 2) + Math.pow(dart.y - node.position('y'), 2));
      }

      nodes.forEach(function(node) {
        var closest = darts.reduce(function(closestDart, curDart) {
          var d = distance(curDart, node);
          if(!closestDart || d < closestDart.distance) {
            return {
              dart: curDart,
              distance: d
            }
          }
          else {
            return closestDart;
          }
        }, null);

        closest.dart.cluster.push(node);
      });

      darts.forEach(dart => {
        console.log("cluster: " + dart.id + " nodes: " + dart.cluster.length);
      });

      // sanity check
      // var numNodes = nodes.length;
      // var numNodesInCluster = darts.reduce((n,d) => { return n + d.cluster.length; }, 0);
      // console.log(numNodes, numNodesInCluster);

      return darts.map(d => { return d.cluster; });
    });


  };

  if( typeof module !== 'undefined' && module.exports ){ // expose as a commonjs module
    module.exports = register;
  }

  if( typeof define !== 'undefined' && define.amd ){ // expose as an amd/requirejs module
    define('cytoscape-cyjs-simple-cluster', function(){
      return register;
    });
  }

  if( typeof cytoscape !== typeof undefined && $ ){ // expose to global cytoscape (i.e. window.cytoscape)
    register( cytoscape, $ );
  }

})();
