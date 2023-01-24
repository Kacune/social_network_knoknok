var filter = new Vue({
    el: '#filter_block',
    data: {
        list_age: [],
        ip: '',
        cities: [],
        countries: []
    },
    created: function(){
        var i = 18;
        list_age_temp = [];
        while(i!=101){
            list_age_temp.push(i);
            i++;
        }
        this.list_age = list_age_temp;
        this.get_city();
    },
    methods: {
        json(url) {
            return fetch(url).then(res => res.json());
        },
        async get_city(){
        }
    }
})