var suggestions_page = new Vue({
    el: "#suggestions_page_my",
    data: {
        suggestions: [],
        suggestions_list: [],
        themes: [],
        user: [],
        user_info: [],
        first_name: '',
    },
    async created() {
        this.get_suggestions();
    },
    methods: {
        open_create_suggest(){
            main_content.isActive = true
        },
        open_suggest(element){
            element.classList.add('opened');
            element.querySelector('.lorem').classList.remove('open_lorem');
            element.querySelector('.button_one_suggest ').classList.add('hiden_write');
        },
        close_suggest(element){
            element.classList.remove('opened');
            element.querySelector('.lorem').classList.add('open_lorem');
            element.querySelector('.button_one_suggest ').classList.remove('hiden_write');
        },
        open_confirm(id, index, elem){
            confirmation_window.id = id;
            confirmation_window.index = index;
            confirmation_window.elem = elem;
            confirmation_window.text_confirmation = 'Вы уверены, что желаете удалить данное предложение?!';
            confirmation_window.isActive = true;
        },
        open_correct(elem){
            correct_suggest.get_suggest(elem);
            correct_suggest.isActive = true;
        },
        async delete_suggest(id, index, elem){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var idetc = await fetch(config.host +'/api/suggestions/delete/'+id, {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                }
            );
            this.suggestions_list.splice(index, 1);
            suggestions_bar.suggestions_list.splice(suggestions_bar.suggestions_list.indexOf(elem), 1);
        },
        async get_suggestions(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var id = localStorage.getItem('id');
            var suggestions = await fetch(config.host + '/api/s_list', {
                    method: 'get',
                    headers: {
                        "X-CSRFToken": csrftoken,
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let suggestions_list = await suggestions.json();
            this.suggestions = suggestions_list;
            var now = new Date();
            for (var i = 0; i < suggestions_list.length; i++) {
                var dur_for_if = new Date(suggestions_list[i].duration);
                if(dur_for_if > now && suggestions_list[i].user.id == id){
                    this.suggestions_list.push({'description': suggestions_list[i].description, 'duration': suggestions_list[i].duration, 'fire_suggestion': suggestions_list[i].fire_suggestion, 'id': suggestions_list[i].id, 'theme': suggestions_list[i].theme.name, 'theme_id': suggestions_list[i].theme.id, 'time_create': suggestions_list[i].time_create, 'user': suggestions_list[i].user.id, 'avatar': suggestions_list[i].user.avatar, 'first_name': suggestions_list[i].user.first_name});
                }
            }
        },
        pathAvatar(index){
            return `media/${this.suggestions_list[index].avatar}`;
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

var confirmation_window = new Vue({
    el: "#confirmation_window",
    data: {
        isActive: false,
        id: 0,
        index: 0,
        elem: '',
        text_confirmation: ''
    },
    methods: {
        async yes_delete(){
            suggestions_page.delete_suggest(this.id, this.index, this.elem);
            this.isActive = false;
        },
        deactivate_window(){
            this.isActive = false;
        }
    }
})


var correct_suggest = new Vue({
    el: "#correct_suggest",
    data: {
        isActive: false,
        themes: [],
        theme: 0,
        sel_theme: 0,
        suggest: {
            'description': '',
            'theme': '',
            'duration': '',
            'fire_suggestion': false,
            'user': 0
        }
    },
    async created() {
        await this.getThemes();
    },
    methods: {
        readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
        get_suggest(elem){
            this.suggest.description = elem.description;
            this.suggest.theme = elem.theme_id;
            this.suggest.duration = elem.duration;
            this.suggest.id = elem.id;
        },
        async getThemes(){
            var csrftoken = this.readCookie('csrftoken');
            var idetc = await fetch(config.host +'/api/ts_list', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let themes_list = await idetc.json();
            for (let i = 0; i < themes_list.length; i++) {
                    this.themes.push({'id':themes_list[i].id, 'name': themes_list[i].name});
            }
        },
        async createSuggest(){
            var csrftoken = this.readCookie('csrftoken');
            this.suggest.user = Number(window.localStorage.getItem('id'));
            var now = new Date();
            if (new Date(this.suggest.duration) < new Date(now.setDate(now.getDate()+1))){
                this.suggest.fire_suggestion = true;
            }
            this.suggest.theme = this.theme;
            console.log(this.suggest);
            var idetc = await fetch(config.host +'/api/suggestions/update/'+this.suggest.id, {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify(this.suggest)
                }
            );
            this.isActive = false;
            success_suggest.isActive = true;
            setTimeout(function () {
                success_suggest.isActive = false;
            }, 2000);
            document.location.reload();

        }
    }
})