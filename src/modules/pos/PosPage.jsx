import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Search, Trash2 } from 'lucide-react';
import { getBusinessProfile } from '../../data/businessProfile';
import { medicines } from '../../data/mockData';

const defaultCart = [
  { name: 'Paracetamol 500mg', qty: 3, unitPrice: 1200 },
  { name: 'Amoxicillin 500mg', qty: 2, unitPrice: 2300 },
  { name: 'Cough Syrup 120ml', qty: 1, unitPrice: 9600 },
];

export default function PosPage() {
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [cart, setCart] = useState(defaultCart);

  const productResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return medicines.slice(0, 4);

    return medicines.filter((item) =>
      item.name.toLowerCase().includes(query)
      || item.code.toLowerCase().includes(query)
      || item.barcode.toLowerCase().includes(query),
    ).slice(0, 5);
  }, [search]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [cart],
  );

  const total = subtotal;
  const receivedAmount = Number(amountReceived || 0);
  const change = receivedAmount - total;
  const balanceDue = total - receivedAmount;

  const addToCart = (medicine) => {
    setCart((current) => {
      const existing = current.find((item) => item.name === medicine.name);

      if (existing) {
        return current.map((item) =>
          item.name === medicine.name ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      return [...current, { name: medicine.name, qty: 1, unitPrice: medicine.price }];
    });
  };

  const updateQty = (itemName, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.name === itemName ? { ...item, qty: Math.max(0, item.qty + delta) } : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeFromCart = (itemName) => {
    setCart((current) => current.filter((item) => item.name !== itemName));
  };

  const exportReceiptPdf = ({ businessProfile, saleReference, saleDate, received, paymentMethod, total, subtotal, change, cartItems }) => {
    const doc = new jsPDF({ unit: 'pt', format: [260, 520] });
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    let y = 26;

    doc.setFillColor(37, 99, 235);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(18, 18, pageWidth - 36, 40, 8, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(businessProfile.pharmacyName, centerX, 34, { align: 'center' });

    y = 72;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(businessProfile.address, centerX, y, { align: 'center' });
    y += 14;
    doc.text(`${businessProfile.contactPhone} • ${businessProfile.email}`, centerX, y, { align: 'center' });

    y += 22;
    doc.setDrawColor(226, 232, 240);
    doc.line(18, y, pageWidth - 18, y);

    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Receipt #', 24, y);
    doc.text(saleReference, pageWidth - 24, y, { align: 'right' });
    y += 16;
    doc.text('Date', 24, y);
    doc.text(saleDate, pageWidth - 24, y, { align: 'right' });
    y += 16;
    doc.text('Payment', 24, y);
    doc.text(paymentMethod, pageWidth - 24, y, { align: 'right' });

    y += 18;
    doc.line(18, y, pageWidth - 18, y);

    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('ITEM', 24, y);
    doc.text('QTY', centerX - 28, y, { align: 'center' });
    doc.text('TOTAL', pageWidth - 24, y, { align: 'right' });

    y += 10;
    doc.setFont('helvetica', 'normal');

    cartItems.forEach((item) => {
      const itemTotal = item.qty * item.unitPrice;
      y += 16;
      doc.text(item.name, 24, y, { maxWidth: 96 });
      doc.text(String(item.qty), centerX - 28, y, { align: 'center' });
      doc.text(`${businessProfile.currency} ${itemTotal.toLocaleString()}`, pageWidth - 24, y, { align: 'right' });
    });

    y += 20;
    doc.line(18, y, pageWidth - 18, y);

    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', 24, y);
    doc.text(`${businessProfile.currency} ${subtotal.toLocaleString()}`, pageWidth - 24, y, { align: 'right' });
    y += 16;
    doc.text('Amount received', 24, y);
    doc.text(`${businessProfile.currency} ${received.toLocaleString()}`, pageWidth - 24, y, { align: 'right' });
    y += 16;
    doc.text('Change', 24, y);
    doc.text(`${businessProfile.currency} ${Math.max(change, 0).toLocaleString()}`, pageWidth - 24, y, { align: 'right' });

    y += 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', 24, y);
    doc.text(`${businessProfile.currency} ${total.toLocaleString()}`, pageWidth - 24, y, { align: 'right' });

    y += 26;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(businessProfile.receiptFooter, centerX, y, { align: 'center' });

    doc.save(`${saleReference}.pdf`);
  };

  const printReceipt = ({ businessProfile, saleReference, saleDate, received, paymentMethod, total, subtotal, change, cartItems }) => {
    const rows = cartItems.map((item) => {
      const itemTotal = item.qty * item.unitPrice;
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>${businessProfile.currency} ${item.unitPrice.toLocaleString()}</td>
          <td>${businessProfile.currency} ${itemTotal.toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    const printWindow = window.open('', '_blank', 'width=430,height=760');

    if (!printWindow) {
      toast.error('Your browser blocked the print window. Please allow pop-ups and try again.');
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Receipt - ${saleReference}</title>
          <style>
            body {
              margin: 0;
              padding: 24px 18px 32px;
              font-family: Arial, sans-serif;
              color: #0f172a;
              background: #fff;
            }
            .receipt {
              max-width: 360px;
              margin: 0 auto;
              text-align: left;
            }
            .brand {
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 10px;
              margin-bottom: 14px;
              text-align: center;
            }
            h1 {
              margin: 0;
              font-size: 22px;
            }
            p {
              margin: 4px 0 0;
              font-size: 11px;
              color: #475569;
            }
            .meta {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              font-size: 11px;
              margin-bottom: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-top: 10px;
            }
            th, td {
              text-align: left;
              padding: 6px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            th:last-child, td:last-child {
              text-align: right;
            }
            .totals {
              border-top: 1px solid #e2e8f0;
              margin-top: 12px;
              padding-top: 12px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              font-size: 11px;
              margin-bottom: 6px;
            }
            .total-row {
              font-size: 14px;
              font-weight: 700;
              margin-top: 10px;
            }
            .footer {
              margin-top: 16px;
              padding-top: 12px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              font-size: 11px;
              color: #475569;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt {
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="brand">
              <h1>${businessProfile.pharmacyName}</h1>
              <p>${businessProfile.address}</p>
              <p>${businessProfile.contactPhone} • ${businessProfile.email}</p>
            </div>

            <div class="meta"><span>Receipt #</span><strong>${saleReference}</strong></div>
            <div class="meta"><span>Date</span><strong>${saleDate}</strong></div>
            <div class="meta"><span>Cashier</span><strong>Pharmacist</strong></div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row"><span>Subtotal</span><strong>${businessProfile.currency} ${subtotal.toLocaleString()}</strong></div>
              <div class="totals-row"><span>Payment</span><strong>${paymentMethod}</strong></div>
              <div class="totals-row"><span>Amount received</span><strong>${businessProfile.currency} ${received.toLocaleString()}</strong></div>
              <div class="totals-row"><span>Change</span><strong>${businessProfile.currency} ${Math.max(change, 0).toLocaleString()}</strong></div>
              <div class="totals-row total-row"><span>Total</span><strong>${businessProfile.currency} ${total.toLocaleString()}</strong></div>
            </div>

            <div class="footer">${businessProfile.receiptFooter}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const handleCheckout = () => {
    const businessProfile = getBusinessProfile();

    if (!cart.length) {
      toast.error('Add at least one item before checkout');
      return;
    }

    const received = Number(amountReceived || 0);

    if (!received || received <= 0) {
      toast.error('Enter the amount received before completing the sale');
      return;
    }

    if (received < total) {
      Swal.fire({
        title: 'Payment is still short',
        text: `Customer still owes UGX ${balanceDue.toLocaleString()}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1d4ed8',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Record partial payment',
        cancelButtonText: 'Review cart',
      }).then((result) => {
        if (result.isConfirmed) {
          toast.error('Partial payment recorded. Complete the balance before closing the sale.');
        }
      });

      return;
    }

    Swal.fire({
      title: 'Complete checkout?',
      html: `
        <div style="text-align:left;">
          <p><strong>Payment method:</strong> ${paymentMethod}</p>
          <p><strong>Total:</strong> UGX ${total.toLocaleString()}</p>
          <p><strong>Amount received:</strong> UGX ${received.toLocaleString()}</p>
          <p><strong>Change:</strong> UGX ${Math.max(change, 0).toLocaleString()}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Confirm sale',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const saleReference = `TXN-${Date.now().toString().slice(-6)}`;
      const saleDate = new Date().toLocaleString();
      const itemBreakdown = cart
        .map(
          (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>UGX ${item.unitPrice.toLocaleString()}</td>
              <td>UGX ${(item.qty * item.unitPrice).toLocaleString()}</td>
            </tr>
          `,
        )
        .join('');

      setCart([]);
      setAmountReceived('');
      setPaymentMethod('cash');
      setSearch('');

      Swal.fire({
        title: 'Receipt',
        html: `
          <div style="font-family:Arial, sans-serif; text-align:left; width:100%; color:#0f172a;">
            <div style="border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:12px; text-align:center;">
              <h3 style="margin:0; font-size:24px;">${businessProfile.pharmacyName}</h3>
              <p style="margin:4px 0 0; font-size:12px; color:#475569;">${businessProfile.address}</p>
              <p style="margin:4px 0 0; font-size:12px; color:#475569;">${businessProfile.contactPhone} • ${businessProfile.email}</p>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;">
              <span>Receipt #</span>
              <strong>${saleReference}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;">
              <span>Date</span>
              <strong>${saleDate}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:16px;">
              <span>Cashier</span>
              <strong>Pharmacist</strong>
            </div>

            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              <thead>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <th style="text-align:left; padding:6px 0;">Item</th>
                  <th style="text-align:left; padding:6px 0;">Qty</th>
                  <th style="text-align:left; padding:6px 0;">Price</th>
                  <th style="text-align:right; padding:6px 0;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemBreakdown}
              </tbody>
            </table>

            <div style="border-top:1px solid #e2e8f0; margin-top:12px; padding-top:12px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                <span>Subtotal</span>
                <strong>${businessProfile.currency} ${subtotal.toLocaleString()}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                <span>Payment method</span>
                <strong>${paymentMethod}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                <span>Amount received</span>
                <strong>${businessProfile.currency} ${received.toLocaleString()}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:13px; margin-top:10px;">
                <span>Change</span>
                <strong>${businessProfile.currency} ${Math.max(change, 0).toLocaleString()}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:16px; margin-top:12px; font-weight:700;">
                <span>Total</span>
                <span>${businessProfile.currency} ${total.toLocaleString()}</span>
              </div>
            </div>

            <div style="margin-top:14px; padding-top:12px; border-top:1px solid #e2e8f0; font-size:12px; color:#475569; text-align:center;">
              ${businessProfile.receiptFooter}
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Export PDF',
        denyButtonText: 'Print receipt',
        confirmButtonColor: '#1d4ed8',
        denyButtonColor: '#0f172a',
        showDenyButton: true,
        showCloseButton: true,
        width: '520px',
      }).then((response) => {
        if (response.isConfirmed) {
          exportReceiptPdf({
            businessProfile,
            saleReference,
            saleDate,
            received,
            paymentMethod,
            total,
            subtotal,
            change,
            cartItems: cart,
          });
        }

        if (response.isDenied) {
          printReceipt({
            businessProfile,
            saleReference,
            saleDate,
            received,
            paymentMethod,
            total,
            subtotal,
            change,
            cartItems: cart,
          });
        }
      });

      toast.success(`${saleReference} completed successfully`);
    });
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cash counter</p>
          <h2>Point of sale</h2>
        </div>
      </div>

      <div className="pos-layout">
        <div className="panel-card product-panel">
          <div className="panel-header">
            <h3>Search medicine</h3>
          </div>

          <div className="pos-search-box">
            <Search size={16} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, code or barcode"
            />
          </div>

          <div className="product-results">
            {productResults.map((item) => (
              <button type="button" key={item.code} className="product-result-item" onClick={() => addToCart(item)}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.code}</small>
                </div>
                <span>UGX {item.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel-card totals-card">
          <h3>Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>UGX {subtotal.toLocaleString()}</strong>
          </div>
          <div className="summary-row">
            <span>VAT</span>
            <strong>UGX 0</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>UGX {total.toLocaleString()}</strong>
          </div>
          <label>
            <span>Payment method</span>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="cash">Cash</option>
              <option value="mobile-money">Mobile money</option>
              <option value="card">Card</option>
            </select>
          </label>
          <label>
            <span>Amount received</span>
            <input type="number" value={amountReceived} onChange={(event) => setAmountReceived(event.target.value)} placeholder="Enter amount" />
          </label>
          <div className="summary-row total change-row">
            <span>{receivedAmount >= total ? 'Change' : 'Due'}</span>
            <strong>UGX {Math.max(receivedAmount >= total ? change : balanceDue, 0).toLocaleString()}</strong>
          </div>

          <button type="button" className="primary-button checkout-button" onClick={handleCheckout} disabled={!cart.length}>
            Complete checkout
          </button>
        </aside>
      </div>

      <div className="panel-card pos-cart-panel">
        <div className="panel-header">
          <h3>Cart</h3>
          <span className="cart-count">{cart.length} items</span>
        </div>

        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.name} className="cart-item">
              <div className="cart-item-main">
                <div>
                  <strong>{item.name}</strong>
                  <small>UGX {item.unitPrice.toLocaleString()} each</small>
                </div>
              </div>

              <div className="cart-actions">
                <div className="qty-control">
                  <button type="button" onClick={() => updateQty(item.name, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.name, 1)}>+</button>
                </div>
                <strong>UGX {(item.qty * item.unitPrice).toLocaleString()}</strong>
                <button type="button" className="remove-item-button" onClick={() => removeFromCart(item.name)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
