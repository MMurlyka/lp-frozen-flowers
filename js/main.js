$(window).load(function() {

	new WOW().init({
		mobile: false
	});

	/* sliders */

	$('.visual-slider').slick({
		slidesToShow: 3,
		variableWidth: true,
		centerMode: true,
		responsive: [
			{
				breakpoint: 1010,
				settings: {
					slidesToShow: 2
				},
				breakpoint: 750,
				settings: {
					slidesToShow: 1
				},
				breakpoint: 480,
				settings: {
					arrows: false
				}
			}
		]
	});

	$('.reviews-slider').slick({
		slidesToShow: 1,
		adaptiveHeight: true
	});

	/* end sliders */
	/* anchor link start */

	$(".anchor-link").click(function() {
		return anchor($(this).attr("href"));
	});

	$(".anchor-btn").click(function() {
		return anchor($(this).data('href'));
	});

	/* anchor link end* /
	/* input mask start */
	$(".in-phone").mask("+7 (999) 999-99-99");
	/* input mask end */

	$('form').ajaxForm({
		url: "mail.php",
		beforeSubmit: function(data, $form) {
			var $name = $form.find(".in-name"),
				$phone = $form.find(".in-phone"),
				inst = $.magnificPopup.instance;
			
			printValid($name);
			printValid($phone);

			if( ! (valid($name) && valid($phone)) ) {
				if('st' in inst && 'el' in inst.st) {
					$popupLink = $(inst.st.el).data("mfp-src");
					
					var close = function () {
						$.magnificPopup.open({
							items: {
								src: $popupLink
							}
						});
	
						$(".mfp-close-btn-in, .close").unbind("click", close);
					}
				}

				$.magnificPopup.open({
					items: {
						src: "#form-invalid"
					},

					type: "inline"

				}, 0);

				if('st' in inst && 'el' in inst.st) {
					console.log("invalid popup 2");
					$(".mfp-close-btn-in, .close").bind("click", close);
				}
				return false;
			} else {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: "#form-success"
					},
					type: "inline"
				}, 0);
				
				$form.trigger('reset');
				yaCounter36798385.reachGoal('form');
			}
		},

		success: function(responseText, statusText, xhr, $form) {
			
		}

	});

	$(".visual_btn, .video_btn, .order_btn, .finish_btn, .card_trigger").magnificPopup();
	$(".card_btn").click(function() {
		formBuyTemplate($(this).parent());

		$(".card_trigger").trigger("click");
	});

	$(".catalog_link").click(function () {
		var $this = $(this),
			text = {
				open: "Скрыть часть композиций",
				close: "Открыть все композиции"
			};

		$this.blur();
		if($this.data("open") == 0) {
			$(".catalog_all-cards").removeClass("hidden");
			$this.text(text.open);
			$this.data("open", 1);
		}
		else {
			$(".catalog_all-cards").addClass("hidden");
			$this.text(text.close);
			$this.data("open", 0);
		}

		return false;
	});

	$(".anchor_link").focus(function() {
		$(this).blur();
		return false;
	})

	$(window).scroll(function() {

		if($(this).scrollTop() > $(".catalog").offset().top - 140) {
			$("#filter_fixed").addClass("filter_fixed");
		}

		if($(this).scrollTop() < $(".catalog").offset().top - 140 
			|| $(this).scrollTop() > $(".catalog").offset().top + $(".catalog").height()) {

			$("#filter_fixed").removeClass("filter_fixed");
		}
	});

	$(".sort-by-price").click(function() {
		var $this = $(this),
			cards = cardsExports();

		

		if($(this).hasClass("active")) {

			cards.reverse();
			$(this).find(".filter_sort-icon").toggleClass("i-filter-asc i-filter-desc");
		} else {
			cards.sort(cardsSortByPrice);
			$(this).find(".filter_sort-icon").addClass("i-filter-asc");
			$(".filter_link").removeClass("active");
			$(this).addClass("active");
		}

		
		cardsImports(cards);

		$(".card_btn").click(function() {
			formBuyTemplate($(this).parent());

			$(".card_trigger").trigger("click");
		});

	});

	$(".sort-by-tag").click(function() {
		var $this = $(this),
			cards; 

		window.tag = $this.data("tag");

		if(!$this.hasClass("active")) {
			
			cards = cardsExports();

			cards.sort(cardsSortByTag.bind(this));

			$(".filter_sort-icon").removeClass("i-filter-asc i-filter-desc")
			$(".filter_link").removeClass("active");
			$this.addClass("active");

			cardsImports(cards);

			$(".card_btn").click(function() {
				formBuyTemplate($(this).parent());

				$.magnificPopup.open({
					items: {
						src: "#form-buy"
					}
				});
			});
		}
	});

	/*
	$.magnificPopup.open({
		items: {
			src: "#form-invalid"
		},
		type: "inline"
	}, 0);
	*/
	//$(".mgf-link").magnificPopup();

});

function anchor(id) {
		var d = $(id).offset().top,
			duration = 1100;

		$('html, body');

		$('html, body').animate({ scrollTop: d }, duration, (function () {
			
			//location.hash = id.substr(1);
		}));
		
		return false;
		
}

function valid ($input) {
	if($input.val().length > 2) {
		return true;
	}

	return false;
}

function printValid($input) {

	if(valid($input)) {
		$input.removeClass("invalid");
	} else {
		$input.addClass("invalid");
	}
}

function formBuyTemplate ($data) {

	$("#form-buy").find(".card_pr > img").attr("src", $data.data("img-src"));
	$("#form-buy").find(".card_title").text( $data.data("title"));
	$("#form-buy").find(".card_size").text($data.data("size"));

	if(($data.data("old-price") <= 0) || ($data.data("new-price") <= 0)) {
		$("#form-buy").find(".card_price").html(String($data.data("price")).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + 
			' <span class="i-card-price-rubl"></span>');
	} else {
		$("#form-buy").find(".card_price").html(
			'<span class="card_old-price"> ' + String($data.data("old-price")).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + 
				' <span class="i-card-old-price-rubl"></span> ' +
			'</span>' +
			'<span class="card_new-price"> '	+ String($data.data("new-price")).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') +
				' <span class="i-card-new-price-rubl"> ' +
			'</span>'
			);
	}
}

function cardsExports() {
	var elements = [];

	$(".catalog_card").each(function (index, element) {
		elements.push($(this).remove());
	});

	$(".catalog_cards").empty();
	$(".catalog_all-cards").empty();

	return elements;
}

function cardsImports(elements) {
	var $part = $(".catalog_cards"),
		$all = $(".catalog_all-cards"),
		prev;
		

	elements.forEach(function(cur, i, arr) {
		var container;

		if(i < 15) {
			container = $part
		}
		else {
			container = $all;
		}


		
		container.append(cur);

		if(((i + 1) % 5) == 0) {
			container.append('<div class="clear visible-lg">');
		}

		if(((i + 1) % 3) == 0) {
			container.append('<div class="clear visible-md">');
		}

		if(((i + 1) % 2) == 0) {
			container.append('<div class="clear visible-sm">');
		}
		
		return prev;
	});


}

function cardsSortByPrice (a, b) {
	if($(a).data("new-price") < 0) {
		na = $(a).data("new-price");
	} else {
		na = $(a).data("price");
	}

	if($(b).data("new-price") < 0) {
		nb = $(b).data("new-price");
	} else {
		nb = $(b).data("price");
	}
	
	return na - nb;
} 

function cardsSortByTag(a, b) {
	var a, b;
	na = ($(a).data("tag").split(" ").indexOf(tag) != -1) ? -1 : 1;
	nb = ($(b).data("tag").split(" ").indexOf(tag) != -1) ? -1 : 1;

	return na - nb;
}


