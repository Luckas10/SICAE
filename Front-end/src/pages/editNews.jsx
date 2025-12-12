import "./News.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useState, useEffect, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faImage, faIndent, faInfo } from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api.js";

export default function EditNews() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    async function loadNews() {
      try {
        const { data } = await api.get(`/news/${id}`);

        setTitle(data.title);
        setContent(data.content || "");
        setAddInfo(data.add_info || "");
        setCategory(data.category || "futsal");
        setPriority(data.priority || "none");

        if (data.cover_image) {
          setImageSrc(data.cover_image);
          setCroppedImageUrl(data.cover_image);
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erro ao carregar a notícia!",
        });
      }
    }

    loadNews();
  }, [id]);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;

    const initial = centerCrop(
      makeAspectCrop(
        { unit: "%", width: 90 },
        16 / 9,
        width,
        height
      ),
      width,
      height
    );

    imgRef.current = e.currentTarget;
    setCrop(initial);
    setCompletedCrop(initial);
  };

  useEffect(() => {
    if (completedCrop?.width && completedCrop?.height) {
      generateCroppedImg(completedCrop);
    }
  }, [completedCrop]);

  const generateCroppedImg = (cropToUse) => {
    if (!imgRef.current || !cropToUse?.width) return;

    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement("canvas");
    canvas.width = cropToUse.width * scaleX;
    canvas.height = cropToUse.height * scaleY;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      cropToUse.x * scaleX,
      cropToUse.y * scaleY,
      cropToUse.width * scaleX,
      cropToUse.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setCroppedImageUrl(canvas.toDataURL("image/png"));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCrop(undefined);
      setCompletedCrop(null);
      setCroppedImageUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        content,
        add_info,
        category,
        priority,
        cover_image: croppedImageUrl || imageSrc,
      };

      await api.put(`/news/${id}`, payload);

      Swal.fire({
        icon: "success",
        title: "Notícia atualizada com sucesso!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });

      navigate("/news");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro ao atualizar notícia",
      });
    }
  };

  const handleCancel = () => navigate("/news");

  return (
    <>
      <Header />

      <main className="addnews-page">
        <Sidebar />

        <div className="addNews-content">
          <h2>Editar Notícia</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="titulo">Título</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faFont} className="icon" />
              <input
                type="text"
                id="titulo"
                placeholder="Título da notícia"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <label htmlFor="info">Sub-título</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faInfo} className="icon" />
              <input
                type="text"
                id="info"
                placeholder="Sub-título"
                value={add_info}
                maxLength="150"
                onChange={(e) => setAddInfo(e.target.value)}
              />
            </div>

            <label>Alterar capa da notícia</label>
            <div className="input-icon image-selector-button">
              <label htmlFor="capa_selector" className="input-label">
                <FontAwesomeIcon
                  icon={faImage}
                  className="icon"
                  style={{ color: "white" }}
                />
                Trocar imagem
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
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={16 / 9}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="crop"
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            )}

            {croppedImageUrl && (
              <img
                src={croppedImageUrl}
                alt="preview"
                className="image-preview"
              />
            )}

            <label htmlFor="conteudo">Conteúdo da notícia</label>
            <div className="textarea-icon">
              <FontAwesomeIcon
                icon={faIndent}
                className="icon"
                style={{ marginTop: "0.5rem" }}
              />
              <textarea
                id="conteudo"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            <label>Esporte</label>
            <div className="input-icon">
              <select
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

            <label>Prioridade</label>
            <div className="input-icon">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="none">Sem prioridade</option>
                <option value="top">Topo</option>
                <option value="center">Centro</option>
              </select>
            </div>

            <div className="news-form-buttons">
              <button type="submit">Salvar Alterações</button>
              <button
                type="button"
                onClick={handleCancel}
                className="bnt-cancel"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
