var add_advirsting_form = new Vue({
    el: "#add_advirsting_vue",
    data: {
        'user': 0,
        'baner': '',
        'resolution': true,
        'link': '',
        'country': '',
        'region': '',
        'city': '',
        'count_day': 0,
        'count_in_day': 0,
        'time_show': 0,
        'period_start': '',
        'time_period': '',
        'selectedFile': ''
    },
    async created() {

    },
    methods: {
        async createAdvirsting(event){
            var csrftoken = this.readCookie('csrftoken');
            ls = window.localStorage;
            const formData = new FormData();
            formData.append('baner', this.selectedFile, this.selectedFile.name);
            event.preventDefault();
            formData.append('resolution', this.resolution);
            formData.append('user', ls.getItem('id'));
            formData.append('link', this.link);
            formData.append('country', this.country);
            formData.append('region', this.region);
            formData.append('city', this.city);
            formData.append('count_day', this.count_day);
            formData.append('count_in_day', this.count_in_day);
            formData.append('time_show', this.time_show);
            formData.append('period_start', this.period_start);
            formData.append('time_period', this.time_period);
            axios({
                withCredentials: true,
                url: config.host +'/api/advirsting/create',
                headers: {
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                method: 'POST',
                data: formData
            })
        },
        editImage(event){
            this.selectedFile = event.target.files[0];
        },
        readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    }
})