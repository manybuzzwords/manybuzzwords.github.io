import { FC, useContext, useEffect, useReducer, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { Settings } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';
import { render } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SettingDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('settings');
  const settings: Settings = getSettings();
  const { state, dispatch } = useCreateReducer<Settings>({
    initialState: settings,
  });
  const { dispatch: homeDispatch } = useContext(HomeContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  const handleSave = () => {
    let uriElement = document.getElementById('taskUri') as HTMLInputElement;
    console.log(uriElement.value);
    let tokenElement = document.getElementById('taskToken') as HTMLInputElement;
    console.log(tokenElement.value);
    let uriValue = uriElement.value.replace('http://','https://');
    //let uriValue = uriElement.value;
    let tokenValue = tokenElement.value;
    localStorage.setItem('userUri', uriValue);
    localStorage.setItem('userToken', tokenValue);
    //alert(this.myRandomRef.current.value);
    homeDispatch({ field: 'lightMode', value: state.theme });
    saveSettings(state);
  };

  const getPlaceHolders = () => {
    let result = {"bearerToken": '', "taskUri": ''};
    const bearerToken = localStorage.getItem('userToken');
    result.bearerToken = bearerToken != null ? bearerToken : 'Enter your SnapLogic Task URL';
    const userUri = localStorage.getItem('userUri');
    result.taskUri = userUri != null ? userUri : 'Enter your SnapLogic Task Token';
    return result;
  }

  // Render nothing if the dialog is not open.
  if (!open) {
    return <></>;
  }

  // Render the dialog.
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {t('Settings')}
            </div>

            <div className="text-sm font-bold mb-2 text-black dark:text-neutral-200">
              {t('Theme')}
            </div>

            <div className="text-sm font-bold mb-2 text-black">
              <label className='text-neutral-700 dark:text-neutral-200' htmlFor='taskUri'>Task URI:</label>
              <br/>
              <input className='border-black border-2 w-full' id='taskUri' type='text' placeholder={getPlaceHolders().taskUri} />
            </div>

            <div className="text-sm font-bold mb-2 text-black">
              <label className='text-neutral-700 dark:text-neutral-200' htmlFor='taskToken'>Task Token:</label>
              <br/>
              <input className='border-black border-2 w-full' id='taskToken' type='text' placeholder={getPlaceHolders().bearerToken} />
            </div>

            <select
              className="w-full cursor-pointer bg-transparent p-2 text-neutral-700 dark:text-neutral-200"
              value={state.theme}
              onChange={(event) =>
                dispatch({ field: 'theme', value: event.target.value })
              }
            >
              <option value="dark">{t('Dark mode')}</option>
              <option value="light">{t('Light mode')}</option>
            </select>

<span className='container flex flex-col items-center'>
            <button
              type='button'
              className="w-1/2 px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                localStorage.removeItem('userUri');
                localStorage.removeItem('userToken');
                (document.getElementById('taskUri') as HTMLInputElement).value = '';
                (document.getElementById('taskUri') as HTMLInputElement).placeholder = getPlaceHolders().taskUri;
                (document.getElementById('taskToken') as HTMLInputElement).value = '';
                (document.getElementById('taskToken') as HTMLInputElement).placeholder = getPlaceHolders().bearerToken;
                
              }}>Clear Saved Values</button>
              </span>

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                handleSave();
                onClose();
              }}
            >
              {t('Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
