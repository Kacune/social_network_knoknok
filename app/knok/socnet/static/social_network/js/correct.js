var correct_anketa = new Vue({
    el: "#my_anketa",
    data: {
        characteristics: {
            user: 0,
            height: 0,
            weight: 0,
            body_type: 0,
            marks: 0,
            smoke: 0,
            marital_status: 0,
            child: 0,
            accommodation: 0,
            work: 0,
            alcohol: 0,
            meeting_place: 0,
            sponsorship: 0,
        },
        heights: [],
        weights: [],
        body_type: [],
        marks: [],
        smoke: [],
        marital_status: [],
        child: [],
        accommodation: [],
        work: [],
        alcohol: [],
        meeting_place: [],
        sponsorship: [],
        user_data: {
            "username": "",
            "first_name": null,
            "last_name": null,
            "email": window.localStorage.getItem('email'),
            "birthday": null,
            "middle_name": null,
            "bio": null,
            "gender": "male",
            "city": null,
            "country": null
        },
        bio: '',
        city: '',
        country: '',
        first_name: '',
        last_name: '',
        pk: 0,
        male: true,
        female: false,
    },
    async created(){
        this.getParam();
    },
    methods: {
        async getParam(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var value_response = await fetch(config.host +'/api/characteristics/value/list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                }
            );
            let value_list = await value_response.json();
            for(var i = 0; i < value_list.length; i++){
                if (value_list[i].name == 1){
                    this.heights.push(value_list[i]);
                }
                if (value_list[i].name == 2){
                    this.weights.push(value_list[i]);
                }
                if (value_list[i].name == 4){
                    this.body_type.push(value_list[i]);
                }
                if (value_list[i].name == 5){
                    this.marks.push(value_list[i]);
                }
                if (value_list[i].name == 6){
                    this.smoke.push(value_list[i]);
                }
                if (value_list[i].name == 7){
                    this.marital_status.push(value_list[i]);
                }
                if (value_list[i].name == 8){
                    this.child.push(value_list[i]);
                }
                if (value_list[i].name == 9){
                    this.accommodation.push(value_list[i]);
                }
                if (value_list[i].name == 10){
                    this.work.push(value_list[i]);
                }
                if (value_list[i].name == 11){
                    this.alcohol.push(value_list[i]);
                }
                if (value_list[i].name == 12){
                    this.meeting_place.push(value_list[i]);
                }
                if (value_list[i].name == 13){
                    this.sponsorship.push(value_list[i]);
                }
            }
            var user_got = await fetch(config.host +'/api/user/get/'+ window.localStorage.getItem('id'), {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                }
            );
            this.user_data = await user_got.json();
            console.log(this.user_data)
            if (this.user_data.gender == 'male'){
                this.male = true;
                this.female = false;
            }
            else{
                this.female = true;
                this.male = false;
            }
            //let birthday = new Date(this.user_data.birthday)
            //let year = birthday.getYear();
            //let month = birthday.getMonth();
            //let day = birthday.getDate();
            //this.user_date = new Date(year, month, day);
            //console.log((new Date(this.user_data.birthday)).format('YYYY-MM-DD'));
            let month = String(new Date(this.user_data.birthday).getMonth());
            if (month.length == 1){
                month = '0'+ month;
            }
            this.user_data.birthday = new Date(this.user_data.birthday).getFullYear()+ '-' + month + '-' +new Date(this.user_data.birthday).getDate();
            var characteristics_got = await fetch(config.host +'/api/info/get/'+ window.localStorage.getItem('id'), {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                }
            );
            this.characteristics = await characteristics_got.json();
            console.log(this.characteristics);
        },
        changeGender(sex){
            this.user_data.gender = sex;
            if (this.sex == 'male'){
                this.male = true;
                this.female = false;
            }
            else{
                this.female = true;
                this.male = false;
            }
        },
        async correct(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            let id = localStorage.getItem('id');
            this.characteristics.user = id;
            var char_response = await fetch(config.host +'/api/info/get/'+id, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            }).catch(function(error) {                        // catch
                console.log('Request failed', error);
            });
            let user_info = await char_response.json();
            var char = await fetch(config.host +'/api/info/update/'+id, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                    body: JSON.stringify(this.characteristics)
                }
            );
            alert(this.user_data.birthday);
            var user_kn = await fetch(config.host +'/api/user/update/'+id, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                    body: JSON.stringify(this.user_data)
                }
            );
            console.log(this.user_data);
            document.location.href = config.host_page + '/mypage';
        },
        pathPhoto(index){
            return `media/${this.photos[index].path_photo}`;
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
