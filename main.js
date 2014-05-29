document.addEventListener("DOMContentLoaded", function(event) {
  var R = React.DOM,
    div = R.div;

  var Counter = React.createClass({
    mixins: [ReactFireMixin],
    
    getInitialState: function() {
      return {
        squats: {
          count: 'Loading squats data...',
          timestamp: null
        }
      };
    },          

    componentWillMount: function() {
      this.bindAsObject(new Firebase("https://sq-count.firebaseio.com/squats"), "squats");
    },

    incrementSquat: function(event) {
      this.firebaseRefs['squats'].transaction(function(currentObj) {
        console.log(currentObj.timestamp, (new Date()).valueOf());
        if (currentObj.timestamp < ((new Date()).valueOf() + (10*1000))) {
          currentCount = currentObj.count;
          return {
            count: currentCount + 1,
            timestamp: (new Date()).valueOf()
          };
        }
      });
    },

    decrementSquat: function(event) {
      this.firebaseRefs['squats'].transaction(function(currentObj) {
        currentCount = currentObj.count;
        return {count: currentCount - 1};
      });
    },


    render: function() {
      return div({
        id: 'root'
      }, 
        div({
          className: 'squats'
        },
          R.h2(null, 'Squats'),
          R.span({className: 'realtime-sqaut-count'}, this.state.squats.count),
          R.button({
            className: 'super-button',
            ref: 'incrementer',
            onClick: this.incrementSquat
          }, '+1 Squat'),
          R.button({
            className: 'mega-button',
            ref: 'decrementter',
            onClick: this.decrementSquat
          }, '-1 Squat')
        )  
      );
    }
  });

  React.renderComponent(new Counter(), document.getElementById('render'));
});
