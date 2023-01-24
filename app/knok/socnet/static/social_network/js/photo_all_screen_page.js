var photo_all_screen_page = new Vue({
    el: "#photo_all_screen_page",
    data: {
        photos: [],
        suggestions_list: [],
        themes: [],
        user: [],
        user_info: [],
        first_name: '',
        clicked: false,
        photoSrc: [],
        show_image: false,
        currentImage: 0,
        click: true,
        count_photos: 0,
        isActive: false
    },
    async created() {
        this.get_photos();
    },
    methods: {
        async get_photos(){
            localStorage = window.localStorage;
            var photos = await fetch(config.host +'/api/photos/?user=' + localStorage.getItem('pageId'), {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let photos_list = await photos.json();
            for(var i = 0; i < photos_list.length;i++){
                if(photos_list[i].user == localStorage.getItem('pageId')){
                    this.photoSrc.push(photos_list[i]);
                    this.count_photos++;
                }
            }
            console.log(this.photoSrc);
        },
        number_slide: function (index){
            return index + 1;
        },
        plusSlides(index){
            let query = '[data-image='+this.currentImage+']';
            let el = $('.big_photo').find(query);
            //let el = document.querySelector(query);
            el.addClass('mySlides');
            if(this.currentImage+index > this.photoSrc.length-1){
                this.currentImage = 0;
            }
            else if(this.currentImage+index<0){
                this.currentImage = this.photoSrc.length-1;
            }
            else{
                this.currentImage+=index;
            }
            query = '[data-image='+this.currentImage+']';
            el = $('.big_photo').find(query);
            //el = document.querySelector(query);
            el.removeClass('mySlides');
        },
        show_image_function(index){
            let query = '[data-image='+this.currentImage+']';
            let el = $('.big_photo').find(query);
            el.addClass('mySlides');
            this.currentImage = index;
            query = '[data-image='+index+']';
            el = $('.big_photo').find(query);
            el.removeClass('mySlides');
        },
        pathPhoto(index){
            return `media/${this.photoSrc[index].path_photo}`;
        },
        changeSize(){
            if (this.click == true){
                var big_photo = document.getElementsByClassName("big_photo");
                var img = document.getElementsByClassName("big_photo")[0].getElementsByTagName("img");
                for(i = 0; i < img.length; i++){
                  img[i].style.width = "100vw";
                  img[i].style.height = "48.4375vw";
                }
                var like_loot = document.getElementsByClassName("like_look");
                var prev = document.getElementsByClassName("prev");
                var next = document.getElementsByClassName("next");
                big_photo[0].style.width = "100vw";
                big_photo[0].style.height = "48.4375vw";
                big_photo[0].style.position = "absolute";
                big_photo[0].style.top = "0";
                big_photo[0].style.left = "0";
                for(i = 0; i <like_loot.length; i++){
                  like_loot[i].style.width = "100vw";
                }
                prev[0].style.height = "48.4375vw";
                next[0].style.height = "48.4375vw";
                this.click = false;
              }
              else{
                var big_photo = document.getElementsByClassName("big_photo");
                var img = document.getElementsByClassName("big_photo")[0].getElementsByTagName("img");
                for(i = 0; i < img.length; i++){
                  img[i].style.width = "72.9vw";
                  img[i].style.height = "41vw";
                }
                var like_loot = document.getElementsByClassName("like_look");
                var prev = document.getElementsByClassName("prev");
                var next = document.getElementsByClassName("next");
                big_photo[0].style.width = "72.9vw";
                big_photo[0].style.height = "41vw";
                big_photo[0].style.position = "relative";
                big_photo[0].style.top = "0";
                big_photo[0].style.left = "0";
                for(i = 0; i <like_loot.length; i++){
                  like_loot[i].style.width = "72.9vw";
                }
                prev[0].style.height = "41vw";
                next[0].style.height = "41vw";
                this.click = true;
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
        }
    }
})