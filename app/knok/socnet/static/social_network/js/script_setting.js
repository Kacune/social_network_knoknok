$('.js-tab-triger').click(function() {
   var id = $(this).attr('data-tab'),
      content = $('.js-tab-content[data-tab="'+ id +'"]');

   $('.js-tab-triger.active').removeClass('active'); // 1
   $(this).addClass('active'); // 2

   $('.js-tab-content.active').removeClass('active'); // 3
   content.addClass('active'); // 4
});

var settings_black_list = new Vue({
    el: "#settings_black_list",
    data: {
        black_list: [],
    },
    async created() {
        this.get_black_list();
    },
    methods: {
        async get_black_list(){
            localStorage = window.localStorage;
            var blacklist_response = await fetch(config.host +'/api/blacklist/list/?user='+ localStorage.getItem('id'), {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            this.black_list = await blacklist_response.json();
        },
        async delete_black_list(elem, index){
            console.log(index);
            var csrftoken = this.readCookie('csrftoken');
            var blacklist_response = await fetch(config.host +'/api/blacklist/delete/'+ elem.id, {
                    method: 'post',
                    headers: {
                        "X-CSRFToken": csrftoken,
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            if (blacklist_response.status < 300){
                this.black_list.splice(index, 1);
            }
            console.log(this.black_list);
        },
        pathAvatar(index){
            return `media/${this.black_list[index].black_list_user.avatar}`;
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
