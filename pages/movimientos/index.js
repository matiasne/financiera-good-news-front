import {
  forceTime,
  parseDatetime,
  parseDtype,
  parseMoney,
  parseTotalMoney,
  parseStatus,
  getToday,
} from "@/adapters/Parsers";
import QueryContent, {
  getQueryFullData,
  QueryAutocomplete,
  QueryMultipleSelect,
} from "@/adapters/Querys";
import Button, { IconButton } from "@/components/base/Buttons";
import Col, { Container, Row, Rows } from "@/components/base/Grid";
import Input from "@/components/base/Inputs";
import Table from "@/components/base/Table";
import { Card_Persona_Small } from "@/components/Cards";
import MainLayout from "@/components/layout/MainLayout";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-gold-modal";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import JSZip from "jszip";
import { dataURLtoFile } from "@/adapters/Parsers";
import { saveAs } from "file-saver";
import Spinner from "@/components/base/Spinner";

import {TransactionStatusTypes} from '../models/transactionStatus'


const Page = ({ session }) => {
  const router = useRouter();

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [itemsAmount, setItemsAmount] = useState({});

  const mutationDelete = useMutation(
    (formData) => {
      return axios(getQueryFullData("providerDelete", deleteId, session));
    },
    {
      onSuccess: (data) => {
        toast("Proveedor eliminado exitosamente");
      },
      onError: (err) => {
        toast.error("Ocurrió un error");
      },
      onSettled: (data) => {
        setDeleteId(0);
      },
    }
  );

  const tableHead = [
    {
      id: "id",
      label: "ID",
      type: "id",
      getContent: (e) => e.id,
    },
    {
      id: "createdAt",
      label: "Fecha",
      type: "id",
      getContent: (e) => parseDatetime(e.createdAt),
    },
    {
      id: "id",
      label: "Transacción",
      type: "id",
      getContent: (e) => e.transactionId,
    },
    {
      id: "concept",
      label: "Concepto",
      type: "text",
      getContent: (e) => e.concept,
      isSortable: false,
    },
    {
      id: "providerAccountName",
      label: "Cuenta",
      type: "text",
      getContent: (e) => e.providerAccountName,
      isSortable: false,
    },
    {
      id: "providerAccountNumber",
      label: "Cuenta Número",
      type: "text",
      getContent: (e) => e.providerAccountNumber,
      isSortable: false,
    },
    {
      id: "personName",
      label: "Persona",
      type: "text",
      getContent: (e) => e.personName,
      isSortable: false,
    },
    {
      id: "total",
      label: "Monto",
      type: "money",
      getContent: (e) => e.total,
      isSortable: false,
    },
    {
      id: "fee",
      label: "Total",
      type: "text",
      getContent: (e) => {
        let total = e.total - (e.total / 100) * e.fee;
        let value = parseMoney(total);
        return value;
      },
      isSortable: false,
    },
    {
      id: "balance",
      label: "Balance",
      type: "money",
      getContent: (e) => e.balance,
      isSortable: false,
    },
  ];

  const queryFullData = MovDetails_queryData();
  let viewId = router?.query?.viewId;
  let viewType = router?.query?.viewType || "Depósitos";

  return (
    <>
      <article className="contentSet">
        <div className="contentSet__shrink">
          {/* FILTERS */}
          <AdvancedFilters
            session={session}
            onFilter={setFilters}
            itemsAmount={itemsAmount}
          />
        </div>

        <div className="contentSet__scrollable">
          <Container size="fluid">
            <QueryContent
              id={"movimientoSearch"}
              queryData={{
                size: 20,
                sort: sort,
                order: order,
                ...filters,
              }}
              hasPagination
              session={session}
              // emptyContent={<NoResults />}
              content={(data, queryData) => {
                let items = data.data;
                setItemsAmount(data.total);
                return (
                  <Table
                    striped={false}
                    lined={true}
                    tableData={items}
                    tableHead={tableHead}
                    isTableActionsCompressed={false}
                    tableActions={[
                      {
                        label: "Ver detalle",
                        icon: "file",
                        makeLink: (e) =>
                          "?viewId=" +
                          e.transactionId +
                          "&viewType=" +
                          parseDtype(e.transactionDtype, true),
                      },
                    ]}
                    queryData={queryData}
                    // isSortable={false}
                    onSort={(e) => {
                      setOrder(e.order);
                      setSort(e.sort);
                    }}
                  />
                );
              }}
            />
          </Container>
        </div>

        <div className="--big">
          <Modal
            title={
              viewId ? "Detalle de " + queryFullData[viewType]?.singular : " "
            }
            display={router.query.viewId && router.query.viewType}
            cancelIsClose
            overlayIsCancel
            cancel={{
              text: "Cancelar",
              handler: () => {
                router.back();
              },
            }}
            body={
              router.query.viewId && router.query.viewType ? (
                <QueryContent
                  id={
                    queryFullData[viewType]?.id &&
                    queryFullData[viewType].id.replace("Search", "Get")
                  }
                  session={session}
                  queryData={viewId}
                  content={(data) => {
                    return queryFullData[viewType]?.detailBody(data);
                  }}
                />
              ) : (
                <div></div>
              )
            }
          />
        </div>
      </article>
    </>
  );
};

Page.layout = MainLayout;
Page.layoutProps = {
  title: "Movimientos",
  // actionLink: '/envios/nuevo',
};
export default Page;

// PAGE FILTERS
function AdvancedFilters({ session, itemsAmount, onFilter = () => null }) {
  const [client, setClient] = useState(null);
  const [provider, setProvider] = useState(null);
  const [status,setStatus] = useState([]);
  const [providersAccounts, setProvidersAccounts] = useState([]);
  const router = useRouter();
  const [form, setForm] = useState({
    from: new Date(),
    to: null,
  });
  const [internalFilters, setInternalFilters] = useState({});
  const [showItemsAmountAlert, setShowItemsAmountAlert] = useState(false);
  const [showSpinnerTicketDownload, setShowSpinnerTicketDownload] =  useState(false);

  useEffect(() => {

    
    console.log(router.query)

    if (router.query?.clienteId > 0) {
      mutationGetC.mutate(router.query?.clienteId);
    } else {
      setClient(null);
    }

    if (router.query?.proveedorId > 0) {
      mutationGetP.mutate(router.query?.proveedorId);
    } else {
      setProvider(null);
    }

    if (router.query?.cuentaProveedorId) {
      setProvidersAccounts(router.query.cuentaProveedorId.split(",").map(i=>Number(i)))
    }

    if (router.query?.status) {
      setStatus(router.query.status.split(","))
    }
    
  }, []);

  useEffect(() => {
    setInternalFilters({
      personId: provider?.id || client?.id,
      personType: provider ? "Proveedor" : "Cliente",
      personName: provider?.name || client?.name,
      providerAccountId: providersAccounts,
      from: forceTime(form?.from, true),
      to: forceTime(form?.to, false),
      status:status
    });
    onFilter({
      personId: provider?.id || client?.id,
      from: forceTime(form?.from, true),
      to: forceTime(form?.to, false),
      providerAccountId: providersAccounts,
      status:status
    });
    console.log(forceTime(form?.from, true));

   

  }, [provider, client, providersAccounts, status,form]);

  const mutationGetC = useMutation(
    (id) => {
      return axios(getQueryFullData("clientGet", id, session));
    },
    {
      onSuccess: (data) => {
        setClient(data.data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const mutationGetP = useMutation(
    (id) => {
      return axios(getQueryFullData("providerGet", id, session));
    },
    {
      onSuccess: (data) => {
        setProvider(data.data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const mutationGetTickets = useMutation(
    (formData) => {
      setShowSpinnerTicketDownload(true);
      return axios(
        getQueryFullData("depositoSearchTickets", formData, session)
      );
    },
    {
      onSuccess: (data) => {
        let items = data.data.data;
        let zip = new JSZip();
        items.map((item, i) => {
          if (item.file.indexOf("data") > -1)
            item.file &&
              zip.file(
                item.cuit +
                  "-" +
                  item.id +
                  (item.file.indexOf("data:image") > -1 ? ".jpg" : ".pdf"),
                dataURLtoFile(
                  item.file,
                  "goodnews-comprobante-" +
                    item.id +
                    (item.file.indexOf("data:image") > -1 ? ".jpg" : ".pdf")
                )
              );
        });

        zip.generateAsync({ type: "blob" }).then(function (content) {
          saveAs(content, "goodnews-comprobantes.zip");
        });
        setShowSpinnerTicketDownload(false);
      },
      onError: (err) => {
        setShowSpinnerTicketDownload(false);
        console.log(err);
      },
    }
  );

  const dowloandTickets = () => {
    if (itemsAmount > 100) {
      setShowItemsAmountAlert(true);
    } else {
      mutationGetTickets.mutate({
        size: 100,
        providerId: provider?.id,
        customerId: client?.id,
        providerAccountId:providersAccounts,
        from: forceTime(form.from),
        to: forceTime(form.to,false),
      });
    }
  };

  useEffect(() => {
    if (router.query?.clienteId > 0) {
      mutationGetC.mutate(router.query?.clienteId);
    } else {
      client && setClient(null);
    }

    if (router.query?.proveedorId > 0) {
      mutationGetP.mutate(router.query?.proveedorId);
    } else {
      provider && setProvider(null);
    }

    if (router.query?.cuentaProveedorId) {
      setProvidersAccounts(router.query.cuentaProveedorId.split(",").map(i=>Number(i)))
    }

    if (router.query?.status) {
      setStatus(router.query.status.split(","))
    }

   
  }, [router]);


  const inputProps = {
    onChange: (e) => setForm({ ...form, [e.name]: e.value }),
  };

  let url = Object.keys(internalFilters)
    .map(function (k) {
      if (internalFilters[k]) {
        return (
          encodeURIComponent(k) + "=" + encodeURIComponent(internalFilters[k])
        );
      }
    })
    .join("&");

  return (
    <>
      <Row>
        <Col span={4}>
          <label htmlFor="from" className="input__label">
            Fecha
          </label>
          <div className="flex gap-2 items-center">
            <div className="w-full">
              <Input
                type="date"
                name="from"
                value={form.from}
                maxDate={form.to}
                {...inputProps}
              />
            </div>
            <p>a</p>
            <div className="w-full">
              <Input
                type="date"
                name="to"
                value={form.to}
                minDate={form.from}
                {...inputProps}
              />
            </div>
            {form.from || form.to ? (
              <IconButton
                glyph="close"
                size="md"
                type="light"
                variant="link"
                onClick={() =>
                  setForm({
                    from: null,
                    to: null,
                  })
                }
              />
            ) : null}
          </div>
        </Col>
        <Col span={3}>
          <QueryAutocomplete
            label="Cliente"
            id="clientSearch"
            session={session}
            queryData={{
              sort: "name",
              order: "asc",
            }}
            value={client}
            getOptionLabel={(option) => option.name}
            onSelect={(selection) => {
              if(selection){

                setClient(selection);
                
                let query = router.query;
                query["clienteId"] = selection.id;
                
                delete query.proveedorId;
                setProvider(null)                
                router.push("?"+new URLSearchParams(query).toString());
              }

            }}
          />
        </Col>
        <Col span={3}>
          <QueryAutocomplete
            label="Proveedor"
            id="providerSearch"
            session={session}
            queryData={{
              sort: "name",
              order: "asc",
            }}
            value={provider}
            getOptionLabel={(option) => option.name}
            onSelect={(selection) => {
              
              
              if(selection){
                console.log(selection)
                setProvider(selection);
                let query = router.query;
                query["proveedorId"] = selection.id;
  
                delete query.clienteId;
                setClient(null);
                
                router.push("?"+new URLSearchParams(query).toString());
              }
             
            }}
          />
        </Col>

        <Col span={2}>



        <Input type="multiselect" label="Status" name="statusFilter" id="statusFilter" placeholder="Escribe para buscar" value={status} 
					options={[
              {

                label: 'Ingresado',
                value: 'INGRESADO',
              },
              {
                label: 'Confirmado',
                value: 'CONFIRMADO',
              },
              {
                label: 'Rechazado',
                value: 'RECHAZADO',
              },
              {
                label: 'Error de Carga',
                value: 'ERROR_DE_CARGA',
              },
              {
                label: 'CUIT Incorrecto',
                value: 'CUIT_INCORRECTO',
              },
              {
                label: 'Pendiente de Acreditación',
                value: 'PENDIENTE_DE_ACREDITACION',
              },
            ]
          }
					onChange={(e) => {

            if(e.value){
              setStatus(e.value)
              let query = router.query;
              query["status"] = e.value;
              router.push("?"+new URLSearchParams(query).toString());
            }

           

					}}
			  />
          
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <QueryMultipleSelect
            label="Cuentas"
            id="providerAccountsSearch"
            session={session}
            queryData={{
              sort: "providerId",
              order: "asc",
            }}
            value={providersAccounts}
            getOptionValue={(option) => option?.id}
            getOptionLabel={(option) =>
              option?.providerName +
              " - " +
              option?.name +
              " - #" +
              option?.accountNumber
            }
            onSelect={(selection) => {
              if(selection){
                setProvidersAccounts(selection);
                setClient(null) 
                let query = router.query;
                query["cuentaProveedorId"] = selection;
                delete query.clienteId;
                router.push("?"+new URLSearchParams(query).toString());
              }
              
            }}
          />
        </Col>
        <Col span={4}>
          <label htmlFor="" className="input__label opacity-0">
            -
          </label>
          <Row className="text-align-right">
			<Col span={6}>
			<div className="w-full">
			<Link href={"/movimientos/detalle?" + url}>
				<a>
					<Button type="success" iconStart="file" className="w-full h-7">
					Exportar
					</Button>
				</a>
				</Link>

			</div>
				
			</Col>
            <Col span={6}>
			<div className="w-full">
              <Button
                className="btn btn-success w-full h-7"
                disabled={showSpinnerTicketDownload}
                onClick={dowloandTickets}
              >
                {showSpinnerTicketDownload ? (
                  <Spinner
                    className="w-4 h-4 z-10"
                    spinnerClassName="w-4 h-4 text-main"
                  />
                ) : (
                  "Descargar Tickets "
                )}
              </Button>
            </div>
			</Col>

            
          </Row>
        </Col>
      </Row>
      <Modal
        body={"El resultado de movimientos debe contener menos de 100 items"}
        display={showItemsAmountAlert}
        cancelIsClose
        overlayIsCancel
        options={[
          {
            text: "Aceptar",
            handler: () => {
              setShowItemsAmountAlert(false);
            },
          },
        ]}
        cancel={{
          text: "Cancelar",
          handler: () => {
            setShowItemsAmountAlert(false);
          },
        }}
      />
    </>
  );
}

// MOV DETALLE MODALS
export function MovDetails_queryData() {
  return {
    Todos: {
      id: "transactionSearch",
      tableHead: [
        {
          id: "id",
          label: "ID",
          type: "id",
          getContent: (e) => e.id,
        },
        {
          id: "createdAt",
          label: "Fecha",
          type: "id",
          getContent: (e) => parseDatetime(e.createdAt),
        },
        {
          id: "dtype",
          label: "Tipo",
          type: "text",
          getContent: (e) => parseDtype(e.dtype),
        },
        {
          id: "personName",
          label: "Cliente",
          type: "text",
          getContent: (e) => e.personName,
        },
        {
          id: "total",
          label: "Monto",
          type: "money",
          getContent: (e) => e.total,
        },
      ],
      tableActions: [
        {
          label: "Ver detalle",
          icon: "file",
          makeLink: (e) =>
            "?viewId=" + e.id + "&viewType=" + parseDtype(e.dtype, true),
        },
        {
          label: "Exportar PDF",
          icon: "fileexport",
          makeLink: (e) =>
            "/transacciones/detalle/" +
            parseDtype(e.dtype, true, true) +
            "/" +
            e.id,
        },
      ],
    },
    Depósitos: {
      singular: "Depósito",
      id: "depositoSearch",
      tableHead: [
        {
          id: "id",
          label: "ID",
          type: "id",
          getContent: (e) => e.id,
        },
        {
          id: "createdAt",
          label: "Fecha",
          type: "id",
          getContent: (e) => parseDatetime(e.createdAt),
        },
        {
          id: "customerName",
          label: "Cliente",
          type: "text",
          getContent: (e) => e.customerName,
        },
        {
          id: "providerName",
          label: "Proveedor",
          type: "text",
          getContent: (e) => e.providerName,
        },
        {
          id: "providerAccountName",
          label: "Cuenta",
          type: "text",
          getContent: (e) => e.providerAccountName || "-",
        },
        {
          id: "providerAccountNumber",
          label: "Cuenta Nro.",
          type: "text",
          getContent: (e) => e.providerAccountNumber || "-",
        },
        {
          id: "cuit",
          label: "CUIT",
          type: "text",
          getContent: (e) => e.cuit,
        },
        {
          id: "status",
          label: "Estado",
          type: "text",
          getContent: (e) => parseStatus(e.status),
        },
        {
          id: "total",
          label: "Monto",
          type: "money",
          getContent: (e) => e.total,
        },
      ],
      tableActions: [
        {
          label: "Ver detalle",
          icon: "file",
          makeLink: (e) => "?viewId=" + e.id + "&viewType=" + "Depósitos",
        },
        {
          label: "Exportar PDF",
          icon: "fileexport",
          makeLink: (e) => "/transacciones/detalle/" + "depositos" + "/" + e.id,
        },
        {
          isDivider: true,
        },
        {
          label: "Modificar Estado: Ingresado",
          icon: "arrow",
          handler: (e) => mutation.mutate({ ...e, status: "INGRESADO" }),
        },
        {
          label: "Modificar Estado: Confirmado",
          icon: "arrow",
          handler: (e) => mutation.mutate({ ...e, status: "CONFIRMADO" }),
        },
        {
          label: "Modificar Estado: Rechazado",
          icon: "arrow",
          handler: (e) => mutation.mutate({ ...e, status: "RECHAZADO" }),
        },
        {
          label: "Modificar Estado: Error de Carga",
          icon: "arrow",
          handler: (e) => mutation.mutate({ ...e, status: "ERROR_DE_CARGA" }),
        },
      ],
      detailBody: (data) => {
        return (
          <div className="text-left">
            <Rows cols={4}>
              <Row>
                <Col span={2}>
                  <Card_Persona_Small title={data.customer.name} />
                </Col>
                <Col span={2}>
                  <Card_Persona_Small
                    glyph="moneybag"
                    title={"#" + data.providerAccount.accountNumber}
                    postitle={data.providerAccount.provider.name}
                  />
                </Col>
              </Row>
              <Row cols={4}>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Fecha</p>
                    <p>{parseDatetime(data.createdAt)}</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Tipo</p>
                    <p>Depósito</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Monto</p>
                    <p>{parseMoney(data.total)}</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Estado</p>
                    <p>{parseStatus(data.status, true)}</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Comprobante</p>
                    <p>{"#" + data.internalId}</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">CUIT</p>
                    <p>{data.cuit || "-"}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <div className="dataSet">
                    <p className="dataSet__title">Notas</p>
                    <p>{data.notes || "-"}</p>
                  </div>
                </Col>
              </Row>
            </Rows>
            {data.ticket.file ? (
              <div className="mt-4">
                {data.ticket.file.indexOf("data:image") > -1 ? (
                  <div className="file-iframe">
                    <img src={data.ticket.file} />
                  </div>
                ) : (
                  <iframe src={data.ticket.file} className="file-iframe" />
                )}
              </div>
            ) : (
              <p className="my-8 text-center italic">Sin Comprobante</p>
            )}
          </div>
        );
      },
    },
    Retiros: {
      singular: "Retiro",
      id: "retiroSearch",
      tableHead: [
        {
          id: "id",
          label: "ID",
          type: "id",
          getContent: (e) => e.id,
        },
        {
          id: "createdAt",
          label: "Fecha",
          type: "id",
          getContent: (e) => parseDatetime(e.createdAt),
        },
        {
          id: "customerName",
          label: "Cliente",
          type: "text",
          getContent: (e) => e.customerName,
        },
        {
          id: "paymentIntentionId",
          label: "Nro. Envío",
          type: "number",
          getContent: (e) =>
            e.paymentIntentionId ? "#" + e.paymentIntentionId : "-",
        },
        {
          id: "total",
          label: "Monto",
          type: "money",
          getContent: (e) => e.total,
        },
      ],
      tableActions: [
        {
          label: "Ver detalle",
          icon: "file",
          makeLink: (e) => "?viewId=" + e.id + "&viewType=" + "Retiros",
        },
        {
          label: "Exportar PDF",
          icon: "fileexport",
          makeLink: (e) => "/transacciones/detalle/" + "retiros" + "/" + e.id,
        },
      ],
      detailBody: (data) => {
        return (
          <div className="text-left">
            <Rows cols={4}>
              <Row>
                <Col span={2}>
                  <Card_Persona_Small title={data.customer?.name} />
                </Col>
                <Col span={2}>
                  {data.paymentIntention ? (
                    <Card_Persona_Small
                      glyph="exchange"
                      title={"#" + data.paymentIntention?.id}
                      pretitle={
                        data.paymentIntention?.receiverName +
                        " (" +
                        data.paymentIntention?.receiverDocument +
                        ")"
                      }
                    />
                  ) : (
                    <Card_Persona_Small glyph="exchange" pretitle="Sin envío" />
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Fecha</p>
                    <p>{parseDatetime(data.createdAt)}</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Tipo</p>
                    <p>Retiro</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Monto</p>
                    <p>{parseMoney(data.total)}</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Pagado</p>
                    <p>{data.paymentIntention?.payed ? "Si" : "No"}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <div className="dataSet">
                    <p className="dataSet__title">Notas</p>
                    <p>{data.notes || "-"}</p>
                  </div>
                </Col>
              </Row>
            </Rows>
          </div>
        );
      },
    },
    "Pagos Proveedores": {
      singular: "Pago Proveedor",
      id: "pagoProveedorSearch",
      tableHead: [
        {
          id: "id",
          label: "ID",
          type: "id",
          getContent: (e) => e.id,
        },
        {
          id: "createdAt",
          label: "Fecha",
          type: "id",
          getContent: (e) => parseDatetime(e.createdAt),
        },
        // {
        // 	id: 'customerName',
        // 	label: 'Cliente',
        // 	type: 'text',
        // 	getContent: (e) => e.customerName,
        // },
        {
          id: "providerName",
          label: "Proveedor",
          type: "text",
          getContent: (e) => e.providerName,
        },
        {
          id: "total",
          label: "Monto",
          type: "money",
          getContent: (e) => e.total,
        },
      ],
      tableActions: [
        {
          label: "Ver detalle",
          icon: "file",
          makeLink: (e) =>
            "?viewId=" + e.id + "&viewType=" + "Pagos Proveedores",
        },
        {
          label: "Exportar PDF",
          icon: "fileexport",
          makeLink: (e) =>
            "/transacciones/detalle/" + "pagoProveedor" + "/" + e.id,
        },
      ],
      detailBody: (data) => {
        return (
          <div className="text-left">
            <Rows cols={4}>
              <Row>
                <Col span={2}>
                  <Card_Persona_Small title={data.provider.name} />
                </Col>
              </Row>
              <Row cols={3}>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Fecha</p>
                    <p>{parseDatetime(data.createdAt)}</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Tipo</p>
                    <p>Devolución</p>
                  </div>
                </Col>
                <Col>
                  <div className="dataSet">
                    <p className="dataSet__title">Monto</p>
                    <p>{parseMoney(data.total)}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <div className="dataSet">
                    <p className="dataSet__title">Notas</p>
                    <p>{data.notes || "-"}</p>
                  </div>
                </Col>
              </Row>
            </Rows>
          </div>
        );
      },
    },
  };
}
