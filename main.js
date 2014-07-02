document.addEventListener("DOMContentLoaded", function(event) {
  var R = React.DOM,
    div = R.div;

  var Counter = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
      return {
        squats: {
          count: 0,
          timestamp: null
        },
        timeseries: []
      };
    },

    componentWillMount: function() {
      this.bindAsObject(
        new Firebase("https://sq-count.firebaseio.com/squats"),
                     "squats"
      );
      this.bindAsArray(
        new Firebase("https://sq-count.firebaseio.com/timeseries"),
                     "timeseries"
      );
    },

    incrementSquat: function(event) {
      var time = Date.now()
      var _this = this
      _this.firebaseRefs['squats'].transaction(function(currentObj) {
        if ((time - currentObj.timestamp) > 10000) {
          _this.firebaseRefs['timeseries'].push(time);
          var currentCount = currentObj.count;
          return {
            count: currentCount + 1,
            timestamp: time
          };
        }
      });
    },

    render: function() {
      return div({
        id: 'root'
      },
        div({
          className: 'squats well'
        },
          R.h2({
            style: {
              'marginRight': '5px'
            }
          }, 'Squats: ',
            R.span({className: 'realtime-sqaut-count label label-default'},
                   this.state.squats.count)
          ),
          R.button({
            className: 'super-button btn btn-default',
            ref: 'incrementer',
            onClick: this.incrementSquat,
            style: {
              'marginRight': '5px'
            }
          }, '+1 Squat')
        )
      );
    }
  });

  React.renderComponent(new Counter(), document.getElementById('render'));
});
