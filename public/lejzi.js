(() => {
    'use strict';

    // defining constructor
    this.LazyLoad = function() {

            //changing default settings
        function changeDefaults(source, properties) {
            let property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
      }

        let start_page = 1;
        let start_results = 15;
        const container = document.querySelector('.lazy-container')
        const items = document.querySelectorAll('.lazy-item');
        const url = container.dataset.url;

        //defaults to be passed to constructor
        let defaults = {
            wrapper: container,
            observed_items: items,
            url: url,
            page: start_page,
            results: start_results,
            method: 'GET',
            url_settings: {}
        }

        //overwritre default settings
        if (arguments[0] && arguments.length < 2 && typeof arguments[0] === "object") {
            this.opt = changeDefaults(defaults, arguments[0]);
        } else {
              throw Error('Argument value need to be single object!');
        }
        

        const key = [], 
        value = [];
        let count = 0;

        //count lenght of items in object
        function countProperties(obj) {        
            for(let prop in obj) {
                key.push(prop)
                value.push(obj[prop])
                count++
            }
            return key, value, count;
        }
        countProperties(arguments[0].url_settings)

        // defaining defaults
        const observer_options = {
            root: null,
            rootMargin: '0px',
            threshold: 1
        }
        
        const args = [];

        for(let i = 0; i < count; i++) {
            args.push(`${key[i]}=${value[i]}`)
        }
        const parsed_args = args.toString().replace(/,/g, '&');

            const req_method = arguments[0].method || this.opt.method;
            const last_item = defaults.observed_items[defaults.observed_items.length-1]

            container.addEventListener('scroll', (ev) => {
                if(container.scrollTop + container.clientHeight >= container.scrollHeight) {
                    let request;
                    //construct url 

                    if(defaults.url && (arguments[0].page || arguments[0].page === 0) && arguments[0].results) {
                        request = `${this.opt.url}?page=${this.opt.page}&results=${this.opt.results}&${parsed_args}`;
                    } else if(defaults.url && (arguments[0].page || arguments[0].page === 0)) {
                        request = `${this.opt.url}?page=${this.opt.page}&results=${defaults.results}&${parsed_args}`;
                    } else if(defaults.url && arguments[0].results) {
                        request = `${this.opt.url}?page=${defaults.page}&results=${this.opt.results}&${parsed_args}`;
                    } else if(defaults.url) {
                        request = `${this.opt.url}?page=${defaults.page}&results=${defaults.results}&${parsed_args}`;
                    } else {
                        throw Error('data-url needs to be defined.')
                    }
                    arguments[0].page++ || defaults.page++;

                    fetch(request, {req_method}).then(res => res.json()).then(data => {

                        arguments[0].after_view(data)
                    });
                }
            })

        }

})()
