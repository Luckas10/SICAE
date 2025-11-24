import './Events.css';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';

import { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faImage, faIndent } from '@fortawesome/free-solid-svg-icons';

export default function AddEvent() {

    const [fileName, setFileName] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const imgRef = useRef(null);

    // Quando o usuário seleciona a imagem
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);

            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const initial = centerCrop(
                    makeAspectCrop({ unit: '%', width: 80 }, 16 / 9, img.width, img.height),
                    img.width,
                    img.height
                );
                setCrop(initial);
            };
        };
        reader.readAsDataURL(file);
    };

    // Gera a imagem recortada
    const generateCroppedImg = () => {
        if (!imgRef.current || !crop?.width || !crop?.height) return;

        const canvas = document.createElement("canvas");
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            imgRef.current,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const base64 = canvas.toDataURL("image/png");
        setCroppedImageUrl(base64);
    };

    return (
        <>
            <Header />

            <div className='events-page'>
                <Sidebar />

                <div className='addEvents-content'>
                    <h2>Criar Evento</h2>

                    <form onSubmit={(e) => e.preventDefault()}>
                        
                        <div className='event-colum'>
                            
                            {/* Título */}
                            <label htmlFor="titulo">Título</label>
                            <div className="input-icon">
                                <FontAwesomeIcon icon={faFont} className="icon" />
                                <input type="text" id="titulo" placeholder="Título do evento" />
                            </div>

                            {/* Data */}
                            <label htmlFor="data">Data</label>
                            <div className="input-icon">
                                <input type="date" id="data" />
                            </div>

                            {/* Horário */}
                            <label htmlFor="hora">Horário</label>
                            <div className="input-icon">
                                <input type="time" id="hora" />
                            </div>

                            {/* Local */}
                            <label htmlFor="local">Localização</label>
                            <div className="input-icon">
                                <input type="text" id="local" placeholder="Local do evento" />
                            </div>

                            {/* Upload da capa */}
                            <label>Adicionar capa do evento</label>
                            <div className="input-icon image-selector-button">

                                <label htmlFor="capa_selector" className="input-label">
                                    <FontAwesomeIcon icon={faImage} className="icon" style={{ color: 'white' }} />
                                    Escolher imagem
                                </label>

                                <input
                                    id="capa_selector"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {fileName && <span className="image_name">{fileName}</span>}

                            {/* Crop */}
                            {imageSrc && (
                                <div className="crop-wrapper">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        onComplete={generateCroppedImg}
                                        aspect={16 / 9}
                                    >
                                        <img ref={imgRef} src={imageSrc} alt="crop-area" />
                                    </ReactCrop>
                                </div>
                            )}

                            {/* Preview final */}
                            {croppedImageUrl && (
                                <img
                                    src={croppedImageUrl}
                                    alt="capa do evento cortada"
                                    className="image-preview"
                                />
                            )}

                            {/* Categorias */}
                            <label htmlFor="categorias">Categorias</label>
                            <div className="input-icon">
                                <select name="categorias" id="categorias">
                                    <option value="esporte">Esporte</option>
                                    <option value="cultura">Cultura</option>
                                    <option value="educacao">Educação</option>
                                </select>
                            </div>

                        </div>

                        {/* Coluna 2 */}
                        <div className='event-colum'>
                            
                            {/* Descrição */}
                            
                            <div className="textarea-icon">
                                <label htmlFor="conteudo">Descrição</label>
                              
                                <textarea id="conteudo" placeholder="Descrição do evento..."></textarea>
                            </div>

                            <div className='event-button'>
                                <button type="submit">Salvar</button>
                                <button style={{ backgroundColor: "white", color: "green" }}>Cancelar</button>
                            </div>

                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
