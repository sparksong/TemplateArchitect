app.controller('TemplateController', ['$http', '$filter', function ($http, $filter) {
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

    //Array used to show error / success messages when they occur.
    self.alerts = [];

    //Greeting used - varies depending on time of day.
    self.greeting = '';
    //Output for generated message built from template
    self.output = '';
    //boolean used for showing and hiding add template section
    self.showAddInput = false;

    //Function used to get template information
    self.getTemplates = function () {
        console.log('Entering getTemplates function in TemplateController');
        $http({
            method: 'GET',
            url: './files/Templates.json'
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
            url: './files/Guests.json'
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
            url: './files/Companies.json'
        }).then((response) => {
            self.companyList.list = response.data;
            console.log('Companies: ', self.companyList.list);
        }).catch((error) => {
            console.log(`Error with GET request for Companies in TemplateController: ${error}`);
        });
    };

    //Function used to create output from templace using templateChoice, guestChoice, and companyChoice.
    self.generateOutput = function (templateChoice, guestChoice, companyChoice) {
        console.log('Entering generateOutput function with parameters: ', templateChoice, guestChoice, companyChoice);
        //Used to reset output field and newTemplate field and hide from UI.
        self.showAddInput = false;
        self.output = ''

        if (!!templateChoice) {
            if (!!guestChoice) {
                if (!!companyChoice) {
                    let template = JSON.parse(templateChoice);
                    let guest = JSON.parse(guestChoice);
                    let company = JSON.parse(companyChoice);

                    let outputMessage = getGreeting() + template.message;
                    outputMessage = replacePlaceHolders(outputMessage, guest, company);

                    self.output = outputMessage;
                } else {
                    setAlert('danger', 'Please choose a company from the company list to continue.');
                }
            } else {
                setAlert('danger', 'Please choose a guest from the guest list to continue.');
            }
        } else {
            setAlert('danger', 'You must first choose a template before you can generate output. Please try again.');
        }
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
        if (!!template && !!template.message && !!template.title) {
            let newTemplate = {
                'id': ' ',
                'title': template.title,
                'message': template.message
            };
            console.log('Adding new template to template list: ', newTemplate);

            self.templateList.list.push(newTemplate);

            self.showAddInput = false;
            setAlert('success', 'Successfully added new template!');
        } else {
            setAlert('warning', 'You must fill out both title and message fields to add a new template! Please try again.');
        }
    }

    //Function used to close alert box.
    self.closeAlert = function (index) {
        self.alerts.splice(index, 1);
    };

    //Private function used to success / error messages on the UI
    function setAlert(type, message) {
        self.alerts[0] = {
            type: type,
            msg: message
        };
    };

    //Private function used to set greeting based on hour of day.
    function getGreeting() {
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
        return greeting;
    };

    //Private function used to parse time from startTimeStamp and endTimeStamp
    function getTimeFromTimestamp(timestamp) {
        console.log('Entering getTimeFromTimeStamp function in TemplateController');
        return $filter('date')(timestamp, "HH:mm");
    }

    //Private function used to parse date from startTimeStamp and endTimeStamp
    function getDateFromTimestamp(timestamp) {
        console.log('Entering getDateFromTimestamp function in TemplateController');
        return $filter('date')(timestamp, "MM/dd/yyyy");
    }

    //Private function used to replace placeholders from template
    function replacePlaceHolders(message, guest, company) {
        console.log('Entering replacePlaceHolders function in TemplateController');
        let mapObj = {
            '{firstName}': guest.firstName,
            '{lastName}': guest.lastName,
            '{phone}': guest.phone,
            '{roomNumber}': guest.reservation.roomNumber,
            '{guestName}': guest.firstName + ' ' + guest.lastName,
            '{startTime}': getTimeFromTimestamp(guest.reservation.startTimestamp),
            '{startDate}': getDateFromTimestamp(guest.reservation.startTimestamp),
            '{endTime}': getTimeFromTimestamp(guest.reservation.endTimestamp),
            '{endDate}': getDateFromTimestamp(guest.reservation.endTimestamp),
            '{company}': company.company,
            '{city}': company.city,
            '{timezone}': company.timezone
        };

        let replaced = new RegExp(Object.keys(mapObj).join("|"), "gi");

        return message.replace(replaced, function (matched) {
            return mapObj[matched];
        })
    }

    //Initializing dropdowns with Template, Guest, and Company information.
    self.getTemplates();
    self.getGuests();
    self.getCompanies();
}]);