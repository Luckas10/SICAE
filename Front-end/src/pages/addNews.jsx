import './News.css';
import Header from '../components/general/Header.jsx';
import Sidebar from '../components/general/Sidebar.jsx';

import { useState, useRef } from 'react';

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faImage, faIndent, faInfo } from '@fortawesome/free-solid-svg-icons';

export default function AddNews() {
    const [fileName, setFileName] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const imgRef = useRef(null);

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

            <div className="news-page">
                <Sidebar />

                <div className="addNews-content">
                    <h2>Criar Notícia</h2>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="titulo">Título</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faFont} className="icon" />
                            <input type="text" id="titulo" placeholder="Título da notícia" />
                        </div>

                        <label>Adicionar capa da notícia</label>
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

                        {imageSrc && (
                            <div className="crop-wrapper">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={generateCroppedImg}
                                    aspect={16 / 9}
                                >
                                    <img ref={imgRef} src={imageSrc} alt="to-crop" />
                                </ReactCrop>
                            </div>
                        )}

                        {croppedImageUrl && (
                            <img
                                src={croppedImageUrl}
                                alt="cortado"
                                className="image-preview"
                            />
                        )}

                        <label htmlFor="conteudo">Conteúdo da notícia</label>
                        <div className="textarea-icon">
                            <FontAwesomeIcon icon={faIndent} className="icon" style={{ marginTop: '0.5rem' }} />
                            <textarea id="conteudo" placeholder="Digite o conteúdo..."></textarea>
                        </div>

                        <label htmlFor="info">Informações adicionais</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faInfo} className="icon" />
                            <input type="text" id="info" placeholder="Informações extras" />
                        </div>

                        <label htmlFor="esporte">Esporte</label>
                        <div className="input-icon">
                            <select id="esporte">
                                <option>Futsal</option>
                                <option>Vôlei</option>
                                <option>Basquete</option>
                            </select>
                        </div>

                        <button type="submit">Salvar</button>
                    </form>
                </div>
            </div>
        </>
    );
}
