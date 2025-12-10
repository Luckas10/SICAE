import './News.css';
import Header from '../components/general/Header.jsx';
import Sidebar from '../components/general/Sidebar.jsx';

import { useState, useEffect, useRef } from 'react';

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faImage, faIndent, faInfo } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

import api from '../services/api.js';

export default function AddNews() {
    const [fileName, setFileName] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [add_info, setAddInfo] = useState("");
    const [category, setCategory] = useState("futsal");
    const [priority, setPriority] = useState("none");
    
    const imgRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            // resetar estados de crop
            setCrop(undefined);
            setCompletedCrop(null);
            setCroppedImageUrl(null);
        };
        reader.readAsDataURL(file);
    };

    // Define o crop inicial assim que a imagem realmente carrega no DOM
    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;

        const initial = centerCrop(
            makeAspectCrop(
                { unit: "%", width: 90 }, // ocupa 90% da largura
                16 / 9,
                width,
                height
            ),
            width,
            height
        );

        setCrop(initial);
        setCompletedCrop(initial);
    };

    // Gera a imagem cortada com base em um crop específico
    const generateCroppedImg = (cropToUse) => {
        if (!imgRef.current || !cropToUse?.width || !cropToUse?.height) return;

        const image = imgRef.current;

        // Escala de naturalWidth / width renderizado
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        let cropX = cropToUse.x;
        let cropY = cropToUse.y;
        let cropWidth = cropToUse.width;
        let cropHeight = cropToUse.height;

        // Se o crop veio em %, converte para pixels
        if (cropToUse.unit === "%") {
            cropX = (cropToUse.x / 100) * image.width;
            cropY = (cropToUse.y / 100) * image.height;
            cropWidth = (cropToUse.width / 100) * image.width;
            cropHeight = (cropToUse.height / 100) * image.height;
        }

        const canvas = document.createElement("canvas");
        canvas.width = cropWidth * scaleX;
        canvas.height = cropHeight * scaleY;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            cropX * scaleX,
            cropY * scaleY,
            cropWidth * scaleX,
            cropHeight * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const base64 = canvas.toDataURL("image/png");
        setCroppedImageUrl(base64);
    };

    // Sempre que o usuário termina um crop (ou o inicial é setado),
    // gera a imagem cortada automaticamente — mesmo que ele não mexa no retângulo.
    useEffect(() => {
        if (completedCrop?.width && completedCrop?.height) {
            generateCroppedImg(completedCrop);
        }
    }, [completedCrop]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const payload = {
                title,
                content,
                add_info,
                category,
                cover_image: croppedImageUrl || null,
                priority
            };

            await api.post("/news", payload);

            navigate("/news");

            Swal.fire({
                icon: "success",
                title: "Notícia criada com sucesso!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: "success-alert",
                },
            });
        } catch (error) {
            console.error("Erro ao criar notícia:", error);
            const msg =
                error?.response?.data?.detail ||
                "Não foi possível criar a notícia. Tente novamente.";

            Swal.fire({
                icon: "error",
                title: "Erro ao criar notícia.",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: {
                    popup: "error-alert",
                },
            });
        }
    };

    const handleCancel = () => {
        navigate("/news");
    };

    return (
        <>
            <Header />

            <div className="addnews-page">
                <Sidebar />

                <div className="addNews-content">
                    <h2>Criar Notícia</h2>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="titulo">Título</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faFont} className="icon" />
                            <input type="text" id="titulo" placeholder="Título da notícia" value={title} required
                            onChange={(e) => setTitle(e.target.value)}/>
                        </div>

                        <label htmlFor="info">Sub-título</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faInfo} className="icon" />
                            <input type="text" id="info" placeholder="Sub-título da notícia" value={add_info} required maxLength="150"
                            onChange={(e) => setAddInfo(e.target.value)}/>
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
                                style={{ display: "none" }} required
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
                                    <img ref={imgRef} src={imageSrc} alt="to-crop" onLoad={onImageLoad}/>
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
                            <textarea id="conteudo" placeholder="Digite o conteúdo..." value={content}
                            onChange={(e) => setContent(e.target.value)}></textarea>
                        </div>

                        <label htmlFor="esporte">Esporte</label>
                        <div className="input-icon">
                            <select
                                name="categorias"
                                id="categorias"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)} required
                            >
                                <option value="futsal">Futsal</option>
                                <option value="basketball">Basquete</option>
                                <option value="tabletennis">Tênis de Mesa</option>
                                <option value="fighting">Lutas</option>
                                <option value="athletics">Atletismo</option>
                                <option value="volleyball">Voleibol</option>
                                <option value="swimming">Natação</option>
                                <option value="chess">Xadrez</option>
                                <option value="esports">E-sports</option>
                            </select>
                        </div>

                        <label htmlFor="prioridade">Prioridade</label>
                        <div className="input-icon">
                            <select
                                name="prioridades"
                                id="prioridades"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)} required
                            >
                                <option value="none">Sem prioridade</option>
                                <option value="top">Topo</option>
                                <option value="center">Centro</option>           
                            </select>
                        </div>
                        
                        <div className="news-form-buttons">
                            <button type="submit">Salvar</button>
                            <button className='bnt-cancel' type="button" onClick={handleCancel} >
                                Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
