﻿var locationsTable = $('#locations-table').DataTable({
	'paginate': false,
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 }
	],
	'language': JSON.parse(L('datatables_localization')),
	'scrollY': false,
	'colReorder': true,
	'stateSave': true
});

$("#search").on("keyup", function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}
	
	locationsTable.search(value).draw();
});

$(document).on('click', '.location-delete-button', function (e)
{
	var objectName = $(e.currentTarget).attr('data-location-name');
	var objectId = $(e.currentTarget).attr('data-location-id');

	bootbox.confirm({
		message: L('Are you sure to delete location "#1"?', objectName),
		buttons: {
			confirm: {
				label: L('Yes'),
				className: 'btn-success'
			},
			cancel: {
				label: L('No'),
				className: 'btn-danger'
			}
		},
		callback: function(result)
		{
			if (result === true)
			{
				Grocy.Api.Get('delete-object/locations/' + objectId,
					function(result)
					{
						window.location.href = U('/locations');
					},
					function(xhr)
					{
						console.error(xhr);
					}
				);
			}
		}
	});
});
