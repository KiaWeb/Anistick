const loadPost = require("../request/post_body");
const character = require("./main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res) {
	switch (req.method) {
		case "GET": {
			const match = req.url.match(/\/characters\/([^.]+)(?:\.xml)?$/);
			if (!match) return;

			var id = match[1];
			res.setHeader("Content-Type", "text/xml");
			character
				.load(id)
				.then((v) => {
					(res.statusCode = 200), res.end(v);
				})
				.catch((e) => {
					(res.statusCode = 404), res.end(e);
				});
			return true;
		}

		case "POST": {
			if (req.url != "/goapi/getCcCharCompositionXml/") return;
			loadPost(req, res).then(async data => {
				res.setHeader("Content-Type", "text/html; charset=UTF-8");
				character
					.load(data.assetId || data.original_asset_id)
					.then((v) => {
						(res.statusCode = 200), res.end(0 + v);
					}).catch(e => {
						res.statusCode = 404, res.end(1 + e), console.log(e)
					});
			});
			return true;
		}
		default:
			return;
	}
};
