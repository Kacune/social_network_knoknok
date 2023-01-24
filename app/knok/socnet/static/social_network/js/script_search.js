//var click_hide = 0;
//
//$(".hide_search.noclick").click(function(){
//  if (click_hide == 0){
//    $('.any_anketa').addClass('click');
//    $('.hide_search').removeClass('noclick').addClass('click');
//    click_hide = 1;
//  }
//  else{
//    $('.any_anketa').removeClass('click');
//    $('.hide_search').removeClass('click').addClass('noclick');
//    click_hide = 0;
//  }
//});

var search_vue = new Vue({
    el: "#search_vue",
    data: {
        country: '',
        city: '',
        age_start: 0,
        age_end: 0,
        gender: 'male',
        male: true,
        female: false,
        search_list: [],
    },
    async created() {
    },
    methods: {
        async search(){
            this.search_list = [];
            localStorage = window.localStorage;
            var users_list_response = await fetch(config.host +'/api/u_list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let users = await users_list_response.json();

            for (var i = 0; i < users.length; i++){
                let birthday = new Date(users[i].birthday);
                let today = new Date();
                let age = today.getYear() - birthday.getYear();
                let month = today.getMonth() - birthday.getMonth();
                if (month < 0){
                    age--;
                }
                if (age >= this.age_start && age <= this.age_end && users[i].country == this.country && users[i].city == this.city && users[i].gender == this.gender){
                    this.search_list.push({
                        'avatar': users[i].avatar,
                        'username': users[i].first_name + ' ' + users[i].last_name,
                        'age': age,
                        'city': users[i].city,
                        'id': users[i].id
                    });
                }
            }
            search_vue_content.search_list =this.search_list;
        },
        changeGender(sex){
            console.log(this.gender);
            this.gender = sex;
            if (sex == 'male'){
                this.male = true;
                this.female = false;
            }
            else{
                this.female = true;
                this.male = false;
            }
        },
        pageId(index){
            window.localStorage.setItem('pageId', this.search_list[index].id);
        },
        page_link(index){
            return config.host + '/'+this.search_list[index].id;
        },
        pathAvatar(index){
            return `media/${this.search_list[index].avatar}`;
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


var search_vue_content = new Vue({
    el: "#search_vue_content",
    data: {
        search_list: [],
    },
    methods: {
        pageId(index){
            window.localStorage.setItem('pageId', this.search_list[index].id);
        },
        page_link(index){
            return config.host + '/'+this.search_list[index].id;
        },
        pathAvatar(index){
            return `media/${this.search_list[index].avatar}`;
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