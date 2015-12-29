
function makeTab(tab, text) {
  tab.isActive = ko.observable(false);
  tab.text = ko.observable(text);
}

function ValidateViewModel() {
  makeTab(this, 'Validate');
  
  var me = this;
  me.input = ko.observable();
  me.personnummer = ko.observable();
  
  me.tryParse = function () {
    me.personnummer(Personnummer.tryParse(me.input()));
    return false;
  };
}

function GenerateViewModel() {
  makeTab(this, 'Generate fake');
  
  var me = this;
  me.personnummer = ko.observable();
  me.dateOfBirth = ko.observable();
  me.numbers = ko.observable();
  
  me.tryParse = function () {
    var dateOfBirth = moment(me.dateOfBirth()).toDate(),
        numbers = me.numbers();

    me.personnummer(Personnummer.generate(dateOfBirth, numbers));
    return false;
  };
}

function ViewModel() {
  var me = this;

  me.greeting = 'Personnummer';
  
  me.tabs = {
      validate: new ValidateViewModel(),
      generate: new GenerateViewModel()
  };
  
  me.tabLinks = [me.tabs.validate, me.tabs.generate];

  me.onTabClick = function (tab) {
    for (var i=0; i < me.tabLinks.length; i++) {
      me.tabLinks[i].isActive(me.tabLinks[i] === tab);
    }
    return false;
  };

  me.personnummer = ko.pureComputed(function () {
    if (me.tabs.validate.isActive())
      return me.tabs.validate.personnummer();
    else
      return me.tabs.generate.personnummer();
  });
  
  me.isValid = ko.pureComputed(function () {
    return !!me.personnummer();
  });

  me.getAge = ko.pureComputed(function () {
    return me.isValid() && me.personnummer().getAge();
  });

  me.getDateOfBirth = ko.pureComputed(function () {
    return me.isValid() && moment(me.personnummer().getDateOfBirth()).format('DD MMMM YYYY');
  });

  me.toModernString = ko.pureComputed(function () {
    return me.isValid() && me.personnummer().toModernString();
  });

  me.toTraditionalString = ko.pureComputed(function () {
    return me.isValid() && me.personnummer().toTraditionalString();
  });

  me.tryParse = function () {
    me.personnummer(Personnummer.tryParse(me.input()));
    return false;
  };

  me.tabs.validate.isActive(true);
}

