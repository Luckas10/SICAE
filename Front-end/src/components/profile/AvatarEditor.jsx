import { useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import api from "../../services/api";
import Swal from "sweetalert2";
import { useUser } from "../../context/UserContext";

export default function AvatarEditor() {
    const { user, updateAvatar } = useUser();

    const [avatarUrl, setAvatarUrl] = useState("/img/profile.png");

    const [fileName, setFileName] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const imgRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        setAvatarUrl(user.profile_image || "/img/profile.png");
    }, [user]);

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
            setShowModal(true);

            e.target.value = null;
        };
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;

        const initial = centerCrop(
            makeAspectCrop(
                { unit: "%", width: 80 },
                1,
                width,
                height
            ),
            width,
            height
        );

        setCrop(initial);
        setCompletedCrop(initial);
    };

    const generateCroppedImg = (cropToUse) => {
        if (!imgRef.current || !cropToUse?.width || !cropToUse?.height) return;

        const image = imgRef.current;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        let cropX = cropToUse.x;
        let cropY = cropToUse.y;
        let cropWidth = cropToUse.width;
        let cropHeight = cropToUse.height;

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

    useEffect(() => {
        if (completedCrop?.width && completedCrop?.height) {
            generateCroppedImg(completedCrop);
        }
    }, [completedCrop]);

    const handleSaveAvatar = async () => {
        try {
            const imageToSave = croppedImageUrl || avatarUrl;
            if (!imageToSave) return;

            await api.put("/users/me/avatar", {
                profile_image: imageToSave,
            });

            setAvatarUrl(imageToSave);
            setShowModal(false);
            updateAvatar(imageToSave);

            Swal.fire({
                icon: "success",
                title: "Foto de perfil atualizada!",
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
            console.error("Erro ao atualizar a foto de perfil:", error);
            const msg =
                error?.response?.data?.detail ||
                "Não foi possível atualizar a foto de perfil. Tente novamente.";

            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar foto de perfil",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: {
                    popup: "error-alert",
                },
            });
        }
    };

    return (
        <>
            <div className="avatar-wrapper">
                <img
                    src={croppedImageUrl || avatarUrl}
                    className="profile-avatar"
                    alt="Foto de perfil"
                />

                <label className="edit-avatar-btn" htmlFor="avatar_selector">
                    <FontAwesomeIcon icon={faPen} />
                </label>

                <input
                    id="avatar_selector"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Editar foto de perfil</h3>

                        {imageSrc && (
                            <div className="crop-container">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={1}
                                >
                                    <img
                                        ref={imgRef}
                                        src={imageSrc}
                                        alt="crop"
                                        onLoad={onImageLoad}
                                        className="crop-image"
                                    />
                                </ReactCrop>
                            </div>
                        )}

                        <div className="modal-buttons">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="modal-btn save"
                                onClick={handleSaveAvatar}
                            >
                                Salvar foto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
