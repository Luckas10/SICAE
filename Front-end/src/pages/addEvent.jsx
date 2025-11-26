import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faImage } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

export default function AddEvent() {
    const [fileName, setFileName] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("futsal");
    const [description, setDescription] = useState("");

    const imgRef = useRef(null);
    const navigate = useNavigate();

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
                    makeAspectCrop(
                        { unit: "%", width: 80 },
                        16 / 9,
                        img.width,
                        img.height
                    ),
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const safeTime = time || "00:00";
            const startDateTime = new Date(`${date}T${safeTime}:00`);
            const endDateTime = startDateTime;

            const payload = {
                local_id: null,
                title,
                description,
                start_date: startDateTime.toISOString(),
                end_date: endDateTime.toISOString(),
                category,
                cover_image: croppedImageUrl || null,
                // location ainda não está no modelo; se quiser salvar, adicionamos no backend depois
            };

            await api.post("/events", payload);

            await Swal.fire({
                icon: "success",
                title: "Evento criado com sucesso!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            });

            navigate("/events");
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            const msg =
                error?.response?.data?.detail ||
                "Não foi possível criar o evento. Tente novamente.";
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
            });
        }
    };

    const handleCancel = () => {
        navigate("/events");
    };

    return (
        <>
            <Header />

            <div className="events-page">
                <Sidebar />

                <div className="addEvents-content">
                    <h2>Criar Evento</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="event-colum">
                            <label htmlFor="titulo">Título</label>
                            <div className="input-icon">
                                <FontAwesomeIcon icon={faFont} className="icon" />
                                <input
                                    type="text"
                                    id="titulo"
                                    placeholder="Título do evento"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <label htmlFor="data">Data</label>
                            <div className="input-icon">
                                <input
                                    type="date"
                                    id="data"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <label htmlFor="hora">Horário</label>
                            <div className="input-icon">
                                <input
                                    type="time"
                                    id="hora"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>

                            <label htmlFor="local">Localização</label>
                            <div className="input-icon">
                                <input
                                    type="text"
                                    id="local"
                                    placeholder="Local do evento"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <label>Adicionar capa do evento</label>
                            <div className="input-icon image-selector-button">
                                <label htmlFor="capa_selector" className="input-label">
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        className="icon"
                                        style={{ color: "white" }}
                                    />
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
                                        <img ref={imgRef} src={imageSrc} alt="crop-area" />
                                    </ReactCrop>
                                </div>
                            )}

                            {croppedImageUrl && (
                                <img
                                    src={croppedImageUrl}
                                    alt="capa do evento cortada"
                                    className="image-preview"
                                />
                            )}

                            <label htmlFor="categorias">Category</label>
                            <div className="input-icon">
                                <select
                                    name="categorias"
                                    id="categorias"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
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
                        </div>

                        <div className="event-colum">
                            <div className="textarea-icon">
                                <label htmlFor="conteudo">Descrição</label>

                                <textarea
                                    id="conteudo"
                                    placeholder="Descrição do evento..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="event-button">
                                <button type="submit">Salvar</button>
                                <button
                                    type="button"
                                    style={{ backgroundColor: "white", color: "green" }}
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
