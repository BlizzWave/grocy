﻿$('#save-purchase-button').on('click', function(e)
{
	e.preventDefault();

	var jsonForm = $('#purchase-form').serializeJSON();

	Grocy.Api.Get('stock/get-product-details/' + jsonForm.product_id,
		function (productDetails)
		{
			var amount = jsonForm.amount * productDetails.product.qu_factor_purchase_to_stock;

			Grocy.Api.Get('stock/add-product/' + jsonForm.product_id + '/' + amount + '?bestbeforedate=' + Grocy.Components.DateTimePicker.GetValue(),
				function(result)
				{
					var addBarcode = GetUriParam('addbarcodetoselection');
					if (addBarcode !== undefined)
					{
						var existingBarcodes = productDetails.product.barcode || '';
						if (existingBarcodes.length === 0)
						{
							productDetails.product.barcode = addBarcode;
						}
						else
						{
							productDetails.product.barcode += ',' + addBarcode;
						}

						Grocy.Api.Post('edit-object/products/' + productDetails.product.id, productDetails.product,
							function (result) { },
							function(xhr)
							{
								console.error(xhr);
							}
						);
					}

					toastr.success(L('Added #1 #2 of #3 to stock', amount, productDetails.quantity_unit_stock.name, productDetails.product.name));

					if (addBarcode !== undefined)
					{
						window.location.href = U('/purchase');
					}
					else
					{
						$('#amount').val(0);
						Grocy.Components.DateTimePicker.SetValue('');
						Grocy.Components.ProductPicker.SetValue('');
						Grocy.Components.ProductPicker.GetInputElement().focus();
						Grocy.FrontendHelpers.ValidateForm('purchase-form');
					}
				},
				function(xhr)
				{
					console.error(xhr);
				}
			);
		},
		function(xhr)
		{
			console.error(xhr);
		}
	);
});

Grocy.Components.ProductPicker.GetPicker().on('change', function(e)
{
	var productId = $(e.target).val();

	if (productId)
	{
		Grocy.Components.ProductCard.Refresh(productId);

		Grocy.Api.Get('stock/get-product-details/' + productId,
			function(productDetails)
			{
				$('#amount_qu_unit').text(productDetails.quantity_unit_purchase.name);
				
				if (productDetails.product.default_best_before_days.toString() !== '0')
				{
					Grocy.Components.DateTimePicker.SetValue(moment().add(productDetails.product.default_best_before_days, 'days').format('YYYY-MM-DD'));
					$('#amount').focus();
				}
				else
				{
					Grocy.Components.DateTimePicker.GetInputElement().focus();
				}
			},
			function(xhr)
			{
				console.error(xhr);
			}
		);
	}
});

$('#amount').val(0);
Grocy.FrontendHelpers.ValidateForm('purchase-form');

if (Grocy.Components.ProductPicker.InProductAddWorkflow() === false)
{
	Grocy.Components.ProductPicker.GetInputElement().focus();
}
else
{
	Grocy.Components.ProductPicker.GetPicker().trigger('change');
}

$('#amount').on('focus', function(e)
{
	if (Grocy.Components.ProductPicker.GetValue().length === 0)
	{
		Grocy.Components.ProductPicker.GetInputElement().focus();
	}
	else
	{
		$(this).select();
	}
});

$('#purchase-form input').keyup(function(event)
{
	Grocy.FrontendHelpers.ValidateForm('purchase-form');
});

$('#purchase-form input').keydown(function(event)
{
	if (event.keyCode === 13) //Enter
	{
		if (document.getElementById('purchase-form').checkValidity() === false) //There is at least one validation error
		{
			event.preventDefault();
			return false;
		}
		else
		{
			$('#save-purchase-button').click();
		}
	}
});

Grocy.Components.DateTimePicker.GetInputElement().on('change', function(e)
{
	Grocy.FrontendHelpers.ValidateForm('purchase-form');
});

Grocy.Components.DateTimePicker.GetInputElement().on('keypress', function(e)
{
	Grocy.FrontendHelpers.ValidateForm('purchase-form');
});

$('#amount').on('change', function (e)
{
	Grocy.FrontendHelpers.ValidateForm('purchase-form');
});
