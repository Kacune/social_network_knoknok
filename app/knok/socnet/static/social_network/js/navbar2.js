var navbar2 = new Vue({
    el: "#navbar2",
    data: {
        'count_photo_all'  : 0,
        'count_photo_paid' : 0,
        'count_photo_free' : 0,
        'characteristics'  : '',
        'favorite_count': 0,
        'suggestions_count': 0,
        'prices_count': 0,
        black_list_dialogues: [],
    },
    async created() {
        var csrftoken = this.readCookie('csrftoken');
        let ls = window.localStorage;
        var favorite_user = await fetch(config.host +'/api/favorite/get/i/favorite_user/?favorite_user='+ls.getItem('id'), {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
            }
        );
        let list_favorite = [];
        console.log(favorite_user);
        if (favorite_user.status == 200){
            list_favorite = await favorite_user.json();
        }
        var favorite_user_user = await fetch(config.host +'/api/favorite/get/i/user/?user='+ls.getItem('id'), {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
            }
        );
        let list_favorite_user = [];
        if (favorite_user_user.status == 200){
            list_favorite_user = await favorite_user_user.json();
        }
        idetc = await fetch(config.host +'/api/blacklist/is_exict', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('access')
            }
        });
        let black_list = await idetc.json();
        let id_my = localStorage.getItem('id');
        for(var i=0; i < black_list.length; i++){
            if (black_list[i].user.id == id_my || black_list[i].black_list_user.id == id_my){
                if (black_list[i].user.id == id_my){
                    this.black_list_dialogues.push({
                        "user": id_my,
                        "black_list_user": black_list[i].black_list_user.id
                    });
                }
                else {
                    this.black_list_dialogues.push({
                        "user": id_my,
                        "black_list_user": black_list[i].user.id
                    });
                }
            }
        }
        for (var i = 0; i < list_favorite.length; i++){
            for (var j = 0; j < this.black_list_dialogues.length; j++){
                if (list_favorite[i].user != this.black_list_dialogues[j].black_list_user){
                    this.favorite_count++;
                }
            }
        }
        for (var i = 0; i < list_favorite_user.length; i++){
            for (var j = 0; j < this.black_list_dialogues.length; j++){
                if (list_favorite_user[i].favorite_user !=this.black_list_dialogues[j].black_list_user){
                    this.favorite_count++;
                }
            }
        }
        this.favorite_count = list_favorite.length + list_favorite_user.length;
        var suggestions = await fetch(config.host + '/api/s_list', {
                method: 'get',
                headers: {
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
            }
        );
        let suggestions_list = await suggestions.json();
        var now = new Date();
        for (var i = 0; i < suggestions_list.length; i++) {
            var dur_for_if = new Date(suggestions_list[i].duration);
            if(dur_for_if > now){
                this.suggestions_count++;
            }
        }
        ls.setItem('suggestions_count', this.suggestions_count);
        var prices = await fetch(config.host +'/api/price/list', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
            }
        );
        let price_list = await prices.json();
        for (var i = 0; i < price_list.length; i++){
            if (price_list[i].who == ls.getItem('id') && price_list[i].isActive == true){
                this.prices_count++;
            }
        }
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
        }
    }
})