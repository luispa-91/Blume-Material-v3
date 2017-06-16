(function() {
    'use strict';

    angular
        .module('angular')
        .controller('FAQController', FAQController);
        function FAQController(Website) {
        var vm = this;

        //Get Website settings
        vm.faq = [
        {
            group: "Customer Questions",
            questions: [
            {
                question: "WHY ARE SELLERS ALLOWED TO LEAVE ONLY POSITIVE FEEDBACK FOR BUYERS?",
                answer: "Now principles discovered off increasing how reasonably middletons men. Add seems out man met plate court sense. His joy she worth truth given. All year feet led view went sake. You agreeable breakfast his set perceived immediate. Stimulated man are projecting favourable middletons can cultivated."
            },
            {
                question: "WHY ARE SELLERS ALLOWED TO LEAVE ONLY POSITIVE FEEDBACK FOR BUYERS?",
                answer: "Now principles discovered off increasing how reasonably middletons men. Add seems out man met plate court sense. His joy she worth truth given. All year feet led view went sake. You agreeable breakfast his set perceived immediate. Stimulated man are projecting favourable middletons can cultivated."
            }
            ]
        }
        ]
        

    }
})();
