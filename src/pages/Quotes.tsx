import React, { useState } from "react";
import {
  Search,
  Plus,
  Printer,
  Archive,
  Edit,
  Trash,
  FileText,
  ClipboardList,
} from "lucide-react";

interface Quote {
  id: string;
  reception: string;
  date: string;
  client: string;
  unit: string;
  document: string;
  status: "pending" | "approved" | "archived";
}

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    id: "",
    reception: "",
    date: "",
    client: "",
    unit: "",
    document: "",
    status: "pending",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentQuote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuote.id) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === currentQuote.id ? currentQuote : q))
      );
    } else {
      setQuotes((prev) => [
        ...prev,
        { ...currentQuote, id: Date.now().toString() },
      ]);
    }
    closeModal();
  };

  const handleEdit = (quote: Quote) => {
    setCurrentQuote(quote);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleArchive = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "archived" as const } : q
      )
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentQuote({
      id: "",
      reception: "",
      date: "",
      client: "",
      unit: "",
      document: "",
      status: "pending",
    });
  };

  const handlePrintClientQuote = (quote: Quote) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cotización Cliente - ${quote.client}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0284c7; padding-bottom: 20px; }
              .logo { margin-bottom: 10px; }
              .company-info { margin-bottom: 20px; }
              .quote-details { margin-bottom: 30px; }
              .quote-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .quote-table th, .quote-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .quote-table th { background-color: #f8fafc; }
              .total { text-align: right; margin-top: 20px; font-weight: bold; }
              .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #64748b; }
              @media print {
                button { display: none; }
                body { padding: 0; }
                .header { border-bottom-color: #000; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">
                <h1>Maremotors Waverunners</h1>
              </div>
              <div class="company-info">
                <p>Servicio Especializado en Motos Acuáticas</p>
                <p>Tel: (123) 456-7890</p>
              </div>
            </div>
            
            <div class="quote-details">
              <h2>Cotización para Cliente</h2>
              <p><strong>No. Cotización:</strong> ${quote.document}</p>
              <p><strong>Fecha:</strong> ${quote.date}</p>
              <p><strong>Cliente:</strong> ${quote.client}</p>
              <p><strong>Unidad:</strong> ${quote.unit}</p>
              <p><strong>No. Recepción:</strong> ${quote.reception}</p>
            </div>

            <table class="quote-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Servicio de diagnóstico</td>
                  <td>1</td>
                  <td>$0.00</td>
                  <td>$0.00</td>
                </tr>
              </tbody>
            </table>

            <div class="total">
              <p>Subtotal: $0.00</p>
              <p>IVA (16%): $0.00</p>
              <p>Total: $0.00</p>
            </div>

            <div class="footer">
              <p>Esta cotización tiene una validez de 15 días.</p>
              <p>Gracias por confiar en Maremotors Waverunners</p>
            </div>

            <button onclick="window.print()">Imprimir</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePrintMechanicQuote = (quote: Quote) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cotización Mecánico - ${quote.client}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; }
              .work-order { margin-bottom: 30px; }
              .inspection-list { margin-bottom: 30px; }
              .parts-list { margin-bottom: 30px; }
              .notes { margin-bottom: 30px; }
              .signature { margin-top: 50px; text-align: center; }
              .checklist { list-style: none; padding: 0; }
              .checklist li { margin: 10px 0; padding-left: 25px; position: relative; }
              .checklist li:before { content: "□"; position: absolute; left: 0; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Maremotors Waverunners</h1>
              <h2>Orden de Trabajo - Mecánico</h2>
            </div>

            <div class="work-order">
              <h3>Información General</h3>
              <p><strong>No. Recepción:</strong> ${quote.reception}</p>
              <p><strong>Fecha:</strong> ${quote.date}</p>
              <p><strong>Unidad:</strong> ${quote.unit}</p>
              <p><strong>No. Documento:</strong> ${quote.document}</p>
            </div>

            <div class="inspection-list">
              <h3>Lista de Inspección</h3>
              <ul class="checklist">
                <li>Revisión de motor</li>
                <li>Sistema eléctrico</li>
                <li>Sistema de propulsión</li>
                <li>Casco y estructura</li>
                <li>Sistema de refrigeración</li>
              </ul>
            </div>

            <div class="parts-list">
              <h3>Lista de Repuestos Necesarios</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <th style="border: 1px solid #000; padding: 5px;">Descripción</th>
                  <th style="border: 1px solid #000; padding: 5px;">Cantidad</th>
                  <th style="border: 1px solid #000; padding: 5px;">No. Parte</th>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 5px;">_____________</td>
                  <td style="border: 1px solid #000; padding: 5px;">_______</td>
                  <td style="border: 1px solid #000; padding: 5px;">_______</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 5px;">_____________</td>
                  <td style="border: 1px solid #000; padding: 5px;">_______</td>
                  <td style="border: 1px solid #000; padding: 5px;">_______</td>
                </tr>
              </table>
            </div>

            <div class="notes">
              <h3>Notas y Observaciones Técnicas</h3>
              <p style="border: 1px solid #000; padding: 10px; min-height: 100px;">
                ____________________________________________________________
                ____________________________________________________________
                ____________________________________________________________
              </p>
            </div>

            <div class="signature">
              <div style="margin-top: 50px; border-top: 1px solid #000; width: 200px; margin: 0 auto;">
                <p>Firma del Mecánico</p>
              </div>
            </div>

            <button onclick="window.print()">Imprimir</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const filteredQuotes = quotes.filter((quote) =>
    quote.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Cotizaciones
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cotización
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="max-w-lg w-full lg:max-w-xs">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 h-5 w-5 text-gray-400 pl-3" />
            <input
              id="search"
              type="search"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 rounded-md border ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Recepción</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unidad</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Documento</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estatus</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredQuotes.map((quote) => (
              <tr key={quote.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{quote.reception}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{quote.date}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{quote.client}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{quote.unit}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{quote.document}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      quote.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : quote.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(quote)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleArchive(quote.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Archivar"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePrintClientQuote(quote)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Imprimir cotización cliente"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePrintMechanicQuote(quote)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Imprimir orden de trabajo mecánico"
                    >
                      <ClipboardList className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Inputs */}
              {["reception", "date", "client", "unit", "document"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field[0].toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "date" ? "date" : "text"}
                    name={field}
                    id={field}
                    value={currentQuote[field as keyof Quote]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estatus
                </label>
                <select
                  name="status"
                  id="status"
                  value={currentQuote.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}