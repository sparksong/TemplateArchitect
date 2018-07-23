app.controller('TemplateController', ['$http', function ($http) {
    console.log('Entering TemplateController');
    let self = this;

    //Empty lists used to populate dropdowns on the DOM for templates, guests, and companies.
    self.templateList = {
        list: []
    };
    self.guestList = {
        list: []
    };
    self.companyList = {
        list: []
    };

    self.greeting = '';
    self.output = '';
    self.showAddInput = false;

    //Function used to set greeting based on hour of day.
    self.getGreeting = function () {
        console.log('Entering getGreeting function in TemplateController');
        let currentDate = new Date();
        let hours = currentDate.getHours();
        let greeting;

        if (hours < 12) {
            greeting = 'Good morning ';
        } else if (hours >= 12 && hours <= 17) {
            greeting = 'Good afternoon ';
        } else {
            greeting = 'Good evening ';
        }
        self.greeting = greeting;
    };

    //Function used to get template information
    self.getTemplates = function () {
        console.log('Entering getTemplates function in TemplateController');
        $http({
            method: 'GET',
            url: './files/templateList.json'
        }).then((response) => {
            self.templateList.list = response.data;
            console.log('Templates: ', self.templateList.list);
        }).catch((error) => {
            console.log(`Error with GET request for Templates in TemplateController: ${error}`);
        });
    };

    //Function used to get guest information.
    self.getGuests = function () {
        console.log('Entering getGuests function in TemplateController');
        $http({
            method: 'GET',
            url: './files/guestList.json'
        }).then((response) => {
            self.guestList.list = response.data;
            console.log('Guests: ', self.guestList.list);
        }).catch((error) => {
            console.log(`Error with GET request for Guests in TemplateController: ${error}`);
        });
    };

    //Function used to get company information.
    self.getCompanies = function () {
        console.log('Entering getCompanies function in TemplateController');
        $http({
            method: 'GET',
            url: './files/companyList.json'
        }).then((response) => {
            self.companyList.list = response.data;
            console.log('Companies: ', self.companyList.list);
        }).catch((error) => {
            console.log(`Error with GET request for Companies in TemplateController: ${error}`);
        });
    };

    //Function used to create output from templace using templateChoice, guestChoice, and companyChoice.
    //TODO Refactor method to make more readable + testable
    self.generateOutput = function (templateChoice, guestChoice, companyChoice) {
        //Used to reset newTemplate field and hide from UI.
        self.showAddInput = false;
        console.log('Entering generateOutput function with parameters: ', templateChoice, guestChoice, companyChoice);
        let outputMessage = '';
        let template, guest, company;

        if (!!templateChoice) {
            self.getGreeting();
            template = JSON.parse(templateChoice);
            outputMessage = self.greeting + template.message;

            if (!!guestChoice) {
                guest = JSON.parse(guestChoice);
                outputMessage = outputMessage.replace('{firstName}', guest.firstName);
                outputMessage = outputMessage.replace('{lastName}', guest.lastName);
                outputMessage = outputMessage.replace('{phone}', guest.phone);
                outputMessage = outputMessage.replace('{roomNumber}', guest.roomNumber);
                outputMessage = outputMessage.replace('{guestName}', guest.firstName + ' ' + guest.lastName);
            } else {
                //Use a default value instead of empty string?
                outputMessage = outputMessage.replace('{firstName}', '');
                outputMessage = outputMessage.replace('{lastName}', '');
                outputMessage = outputMessage.replace('{phone}', '');
                outputMessage = outputMessage.replace('{roomNumber}', '');
                outputMessage = outputMessage.replace('{guestName}', '');
            }
            if (!!companyChoice) {
                company = JSON.parse(companyChoice);
                outputMessage = outputMessage.replace('{companyName}', company.companyName);
                outputMessage = outputMessage.replace('{companyPhone}', company.companyPhone);
            } else {
                //Use a default value instead of empty string?
                outputMessage = outputMessage.replace('{companyName}', '');
                outputMessage = outputMessage.replace('{companyPhone}', '');
            }
        }
        console.log('Exiting generateOutput function in TemplateController with output message: ', outputMessage);
        self.output = outputMessage;
    };

    //Function that shows input field when add is clicked in template view to create new template. Clearing output as well to hide output div.
    self.addInputToggle = function () {
        console.log('Entering addInputToggle function in TemplateController');
        self.showAddInput = true;
        self.output = '';
    }

    //Function used to submit new template to templateList
    self.addTemplate = function (template) {
        console.log('Entering addTemplate function in TemplateController with template: ', template);
        if (template.message.length > 0 && template.title.length > 0) {
            let newTemplate = {
                'id': ' ',
                'title': template.title,
                'message': template.message
            };

            console.log(newTemplate);

            self.templateList.list.push(newTemplate);

            self.showAddInput = false;
        }
    }

    self.getTemplates();
    self.getGuests();
    self.getCompanies();
}]);