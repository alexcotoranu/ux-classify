var Card = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="card" id={this.props._id}>
        <h2 className="cardAuthor">
          {this.props.word}
        </h2>
        <div className="example">{this.props.example}</div>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});


var Group = React.createClass({
  render: function() {
    return (
      <div className="group" id={this.props._id}>
        {this.props.name}
        
      </div>
    );
  }
});

var Deck = React.createClass({
  render: function() {
    return (
      <div className="deck" id={this.props._id}>
        {this.props.name}
      </div>
    );
  }
});

var Session = React.createClass({
  render: function() {
    return (
      <div className="experiment" id={this.props._id}>
        {this.props.name}
      </div>
    );
  }
});

var Experiment = React.createClass({
  render: function() {
    return (
      <div className="experiment" id={this.props._id}>
        {this.props.name}
      </div>
    );
  }
});

var Project = React.createClass({
  render: function() {
    return (
      <div className="project" id={this.props._id}>
        {this.props.name}
      </div>
    );
  }
});



var OpenDeck = React.createClass({
  getCards: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCardSubmit: function(card) {
    var cards = this.state.data;
    cards.push(card);
    this.setState({data: cards}, function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: card,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.getCards();
    setInterval(this.getCards, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="openDeck">
        <h1>Cards</h1>
        <CardList data={this.state.data} />
        <CardForm onCardSubmit={this.handleCardSubmit} />
      </div>
    );
  }
});

var CardList = React.createClass({
  render: function() {
    var cardNodes = this.props.data.map(function(card, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Card author={card.author} key={index}>
          {card.text}
        </Card>
      );
    });
    return (
      <div className="cardList">
        {cardNodes}
      </div>
    );
  }
});

var CardForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCardSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
  },
  render: function() {
    return (
      <form className="cardForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <OpenDeck url="cards.json" pollInterval={2000} />,
  document.getElementById('content')
);