$(function () {
	var loader = $(".loading-container");
	$("#faucetForm").submit(function (e) {
		e.preventDefault();
		$this = $(this);
		loader.removeClass("hidden");
		var receiver = $("#receiver").val();
		var recaptcha = $("#g-recaptcha").val();
		$.ajax({
			url: "/.netlify/functions/init",
			type: "POST",
			data: JSON.stringify({ receiver, "g-recaptcha": recaptcha })
		}).done(function (data) {
			grecaptcha.reset();
			if (!data.success) {
				loader.addClass("hidden");
				console.log(data)
				console.log(data.error)
				swal("Error", data.error.message, "error");
				return;
			}

			$("#receiver").val('');
			loader.addClass("hidden");
			swal("Success",
				`0.5 PWR has been successfully transferred to <a href="https://testexplorer.maxxchain.org/tx/${data.success.txHash}" target="blank">${receiver}</a>`,
				"success"
			);
		}).fail(function (err) {
			grecaptcha.reset();
			console.log(err);
			loader.addClass("hidden");
		});
	});
});