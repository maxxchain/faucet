$(function () {
	var loader = $(".loading-container");
	$("#faucetForm").submit(function (e) {
		e.preventDefault();
		$this = $(this);
		loader.removeClass("hidden");
		var receiver = $("#receiver").val();
		$.ajax({
			url: "/",
			type: "POST",
			data: $this.serialize()
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
				`0.1 PWR has been successfully transferred to <a href="https://testexplorer.maxxchain.org/tx/${data.success.txHash}" target="blank">${receiver}</a>`,
				"success"
			);
		}).fail(function (err) {
			grecaptcha.reset();
			console.log(err);
			loader.addClass("hidden");
		});
	});
	
	$("#addNetwork").click(function (e) {
		window.ethereum.request({
			method: 'wallet_addEthereumChain',
			params: [{
				chainId: '0x3FF',
				chainName: 'Test MaxxChain',
				nativeCurrency: {
					name: 'PWRT Coin',
					symbol: 'PWRT',
					decimals: 18
				},
				rpcUrls: ['https://testrpc.maxxchain.org'],
				blockExplorerUrls: ['https://testexplorer.maxxchain.org']
			}]
		})
			.catch((error) => {
				console.log(error)
			})
	})

});