export default async function downloadFile(req, res) {
	try {
		const { id } = req.query;
		console.log(id);
		if (!id) {
			res.status(400).json({
				message: "Please provide a file id",
			});
		}

		res.redirect(`http://localhost:3000/api/v2/file/${id}`);
	} catch (error) {
		console.error(error);
	}
}
