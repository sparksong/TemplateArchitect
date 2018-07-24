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
        //Used to reset newTemplate field and hide from UI.
        self.showAddInput = false;
        console.log('Entering generateOutput function with parameters: ', templateChoice, guestChoice, companyChoice);
        let outputMessage = '';
        let template;
        let guest;
        let company;

        if (!!templateChoice) {
            self.getGreeting();
            template = JSON.parse(templateChoice);
            outputMessage = self.greeting + template.message;

            if (!!guestChoice) {
                guest = JSON.parse(guestChoice);
                outputMessage = replaceGuestPlaceHolders(outputMessage, guest, true);
            } else {
                outputMessage = replaceGuestPlaceHolders(outputMessage, guest, false);
            }
            if (!!companyChoice) {
                company = JSON.parse(companyChoice);
                outputMessage = replaceCompanyPlaceHolders(outputMessage, company, true);
            } else {
                outputMessage = replaceCompanyPlaceHolders(outputMessage, company, false);
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
    function replaceGuestPlaceHolders(message, guest, isGuestValued) {
        console.log('Entering replaceGuestPlaceHolders function in TemplateController');
        let mapObj;
        if (isGuestValued) {
            mapObj = {
                '{firstName}': guest.firstName,
                '{lastName}': guest.lastName,
                '{phone}': guest.phone,
                '{roomNumber}': guest.reservation.roomNumber,
                '{guestName}': guest.firstName + ' ' + guest.lastName,
                '{startTime}': getTimeFromTimestamp(guest.reservation.startTimestamp),
                '{startDate}': getDateFromTimestamp(guest.reservation.startTimestamp),
                '{endTime}': getTimeFromTimestamp(guest.reservation.endTimestamp),
                '{endDate}': getDateFromTimestamp(guest.reservation.endTimestamp)
            };
        } else {
            //Use a default value instead of empty strings?
            mapObj = {
                '{firstName}': '',
                '{lastName}': '',
                '{phone}': '',
                '{roomNumber}': '',
                '{guestName}': '',
                '{startTime}': '',
                '{startDate}': '',
                '{endTime}': '',
                '{endDate}': ''
            };
        }
        let replaced = new RegExp(Object.keys(mapObj).join("|"), "gi");

        return message.replace(replaced, function (matched) {
            return mapObj[matched];
        })
    } 

    //Private function used to replace placeholders from template
    function replaceCompanyPlaceHolders(message, company, isCompanyValued) {
        console.log('Entering replaceCompanyPlaceHolders function in TemplateController');
        let mapObj;
        if (isCompanyValued) {
            mapObj = {
                '{company}': company.company,
                '{city}': company.city,
                '{timezone}': company.timezone
            };
        } else {
            mapObj = {
                //Use a default value instead of empty strings?
                '{company}': '',
                '{city}': '',
                '{timezone}': ''
            };
        }
        let replaced = new RegExp(Object.keys(mapObj).join("|"), "gi");

        return message.replace(replaced, function (matched) {
            return mapObj[matched];
        })
    }

    self.getTemplates();
    self.getGuests();
    self.getCompanies();
}]);