import { Jodit } from "jodit-react";
import { IJodit } from "jodit/types/types";
import { uploadImagesFn } from "../../../../../../services/api/appointments";

/**
 * @param {Jodit} jodit
 */
export function preparePaste(jodit: IJodit) {
  jodit.e.on(
    'paste',
    e => {
      jodit.s.insertHTML(
        Jodit.modules.Helpers.getDataTransfer(e)?.getData(Jodit.constants.TEXT_HTML) || ""
      );
    },
    { top: true }
  );
}

export function uploadImage(jodit: IJodit) {
  jodit.e.on(
    'drop',
    async (e: DragEvent) => {
      e.preventDefault();
      const dt = Jodit.modules.Helpers.getDataTransfer(e);
      jodit.s.insertHTML(`
      <p id=loading-text >[Carregando Imagem...]</p>
      <img id=loading-image src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" />
      `);
      if (!dt?.files[0]) return;
      const file = dt?.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const appointmentId = window.location.search.split('=')[1];
      const { data } = await uploadImagesFn(appointmentId, formData);
      const loadingText = document.getElementById('loading-text');
      const loadingImage = document.getElementById('loading-image');
      loadingText?.remove();
      loadingImage?.setAttribute('src', data.url);
    },
    { top: true }
  );
}

export function save(jodit: IJodit, setContent: (content: string) => void) {
  jodit.e.on([
    'blur',
    'drop',
    'paste',
    'clickout',
  ], () => {
    setContent(jodit.value);
  });
}

