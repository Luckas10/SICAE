import { useEffect, useRef, useState, useId } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function CoverField({
    value,
    onChange,
    label = "Adicionar capa do evento",
    inputId, // opcional, se não vier eu gero um id único
}) {
    const [fileName, setFileName] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(value || null);

    const imgRef = useRef(null);

    // id único por instância do componente
    const generatedId = useId();
    const finalInputId = inputId || generatedId;

    // Mantém o componente sincronizado com o value vindo de fora (edição, reset, etc.)
    useEffect(() => {
        if (value) {
            setCroppedImageUrl(value);
        } else {
            setCroppedImageUrl(null);
        }
    }, [value]);

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
        onChange?.(base64);
    };

    useEffect(() => {
        if (completedCrop?.width && completedCrop?.height) {
            generateCroppedImg(completedCrop);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completedCrop]);

    return (
        <div className="event-cover-field">
            {label && <label>{label}</label>}

            <div className="input-icon image-selector-button">
                <label htmlFor={finalInputId} className="input-label">
                    <FontAwesomeIcon
                        icon={faImage}
                        className="icon"
                        style={{ color: "white" }}
                    />
                    Escolher imagem
                </label>

                <input
                    id={finalInputId}
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
                            alt="Área de recorte"
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                </div>
            )}

            {croppedImageUrl && (
                <img
                    src={croppedImageUrl}
                    alt="capa cortada"
                    className="image-preview"
                />
            )}
        </div>
    );
}
