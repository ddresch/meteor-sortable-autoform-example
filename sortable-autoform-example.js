if (Meteor.isClient) {
  Template.example.helpers({    
    exampleOptions: function() {
      return {
        sort: true,
        group: {
          scroll: true,
          name: "exampleSortGroup",
          pull: true
        }
      }
    },
    exampleItems: function() {
      return ExampleItems.find({},{sort: {order: 1}});
    }
  });

  Template.item.helpers({    
    itemFormSchema: function() {
      return Schema.exampleItem;
    },
    formId: function() {
      return 'formExampleItem' + this._id;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if(ExampleItems.find().count() == 0){
      ExampleItems.insert({title: "Test A", order: 1});
      ExampleItems.insert({title: "Test B", order: 2});
      ExampleItems.insert({title: "Test C", order: 3});
    }
  });  
}

// Init DB collection
ExampleItems = new Mongo.Collection('exampleItems');

// Simple collection schema
Schema = {};

Schema.exampleItem = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  order: {
    type: Number,
    label: "Sorting",
    optional: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      if (this.isInsert) {
        var lastSortIndex = ExampleItems.find({}, {sort: {order: -1}, limit: 1});
        
        if(lastSortIndex.count() > 0){
          return lastSortIndex.fetch()[0].order + 1;  
        }

        return 1;
      } else {
        return this.value;
      }
    }    
  }
});

ExampleItems.attachSchema(Schema.exampleItem);

