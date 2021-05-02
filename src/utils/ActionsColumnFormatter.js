/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "~/_metronic/_helpers";

const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  {editComissao, showDetails, options},
) => (
  <>
    {
      options.includes('view') ? 
      <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Visualizar</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => showDetails(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/General/Visible.svg")}
          />
        </span>
      </a>
      </OverlayTrigger> : <></>
    }
  
    {
      options.includes('edit') && row.status_comissao !== 'pago' ? 
      <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Editar</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => editComissao(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>
      </OverlayTrigger> : <></>
    }

    <> </>
   {
     options.includes('delete') ?
     <OverlayTrigger
     overlay={<Tooltip id="products-delete-tooltip">Deletar</Tooltip>}
   >
     <a
       className="btn btn-icon btn-light btn-hover-danger btn-sm"
       onClick={() => {}}
     >
       <span className="svg-icon svg-icon-md svg-icon-danger">
         <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
       </span>
     </a>
   </OverlayTrigger> : <></>
   }
  </>
);

export default ActionsColumnFormatter