    let adversting = new Vue({
        el: '#adversting_bar_vue',
        data: {
            adverstings: [],
            link_big_banner: '',
            img_big_banner: '',
            link_small_banner: '',
            img_small_banner: ''
        },
        async created() {
            await this.get_adverstings();
        },
        methods: {
            async get_adverstings(){
                localStorage = window.localStorage;
                var idetc = await fetch(config.host +'/api/advirsting/get', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                });
                let adverstings = await idetc.json();
                this.adverstings = adverstings;
                for(let i = 0; i < this.adverstings.length; i++){
                    if(this.adverstings[i].resolution == true){
                        this.link_big_banner = this.adverstings[i].link;
                        this.img_big_banner = this.adverstings[i].baner;
                    }
                    else {
                        this.link_small_banner = this.adverstings[i].link;
                        this.img_small_banner = this.adverstings[i].baner;
                    }
                }
            },
            get_big(){
                return `media/${this.img_big_banner}`;
            },
            get_small(){
                return `media/${this.img_small_banner}`;
            },
            current_adversting_big(){
                let i = 0;
                while(i < this.adverstings.length+1){
                    if(i = this.adverstings.length){
                        i = 0;
                    }
                    this.link_big_banner = this.adverstings[i].link;
                    this.img_big_banner = this.adverstings[i].baner;
                    setTimeout(function(){
                        i++;
                        } ,this.adverstings[i].time_show * 1000);
                }

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
            },
        },
  });