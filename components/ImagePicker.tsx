import React, { useCallback, useState } from 'react';
import { Image, View, StyleSheet, useColorScheme, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { addHistoryItem, connectToDatabase } from '../db/db';
import { router } from "expo-router";
import * as tf from '@tensorflow/tfjs'
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'

const modelJSON = require('../assets/model/model.json')
const modelWeights = require('../assets/model/weights.bin')

type ImageState = {
  uri: string | null;
  filename: string;
}

const initialImageState: ImageState = {
  uri: null,
  filename: "",
}

// const loadModel = async (): Promise<void | tf.LayersModel> => {
//   const model = await tf.loadLayersModel(
//     bundleResourceIO(modelJSON, modelWeights)
//   ).catch((e) => {
//     console.log("[LOADING ERROR] info:", e)
//   })
//   return model
// }

const loadModel = async()=>{
  //.ts: const loadModel = async ():Promise<void|tf.LayersModel>=>{
      const model = await tf.loadLayersModel(
          bundleResourceIO(modelJSON, modelWeights)
      ).catch((e)=>{
        console.log("[LOADING ERROR] info:",e)
      })
      return model
  }

  const transformImageToTensor = async (uri)=>{
    //.ts: const transformImageToTensor = async (uri:string):Promise<tf.Tensor>=>{
    //read the image as base64
      const img64 = await FileSystem.readAsStringAsync(uri, {encoding:FileSystem.EncodingType.Base64})
      const imgBuffer =  tf.util.encodeString(img64, 'base64').buffer
      const raw = new Uint8Array(imgBuffer)
      let imgTensor = decodeJpeg(raw)
      const scalar = tf.scalar(255)
    //resize the image
      imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224])
    //normalize; if a normalization layer is in the model, this step can be skipped
      const tensorScaled = imgTensor.div(scalar)
    //final shape of the rensor
      const img = tf.reshape(tensorScaled, [1,224,224,3])
      return img
  }


const makePredictions = async ( batch, model, imagesTensor )=>{
  //.ts: const makePredictions = async (batch:number, model:tf.LayersModel,imagesTensor:tf.Tensor<tf.Rank>):Promise<tf.Tensor<tf.Rank>[]>=>{
  //cast output prediction to tensor
  const predictionsdata= model.predict(imagesTensor)
  //.ts: const predictionsdata:tf.Tensor = model.predict(imagesTensor) as tf.Tensor
  let pred = predictionsdata.split(batch) //split by batch size
  //return predictions 
  return pred
}

  export const getPredictions = async (image)=>{
    await tf.ready()
    const model = await loadModel() as tf.LayersModel
    const tensor_image = await transformImageToTensor(image)
    const predictions = await makePredictions(1, model, tensor_image)
    return predictions    
  }

export default function CustomImagePicker() {
  const [image, setImage] = useState<ImageState>(initialImageState);
  const colorScheme = useColorScheme();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri, filename: result.assets[0].fileName! });
    }
  };

  const handleCancel = () => {
    setImage(initialImageState);
  }

  const saveImage = useCallback(async (image: ImageState) => {
    if (!image || !image.uri) return;
    const hiddenDir = `${FileSystem.documentDirectory}.pomegranate/`;
    // Create the hidden directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(hiddenDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(hiddenDir, { intermediates: true });
    }

    // Create a .nomedia file to hide images from the gallery (for Android)
    const noMediaFile = `${hiddenDir}.nomedia`;
    const noMediaFileInfo = await FileSystem.getInfoAsync(noMediaFile);
    if (!noMediaFileInfo.exists) {
      await FileSystem.writeAsStringAsync(noMediaFile, '');
    }

    // Save the image to the hidden directory
    const fileName = `image_${Date.now()}.jpg`;
    const newImagePath = `${hiddenDir}${fileName}`;

    await FileSystem.copyAsync({
      from: image.uri,
      to: newImagePath,
    });

    return newImagePath;  // Return the new image path for future retrieval
  }, [])

  const handleSubmit = async () => {
    if (!image || !image.uri) return;
    const imagePath = await saveImage(image);
    if (!imagePath) return;
    const db = connectToDatabase();
    await tf.ready()
    const model = loadModel()
    const tensorImage = await transformImageToTensor(image);
    const predictions = await makePredictions(1, model, tensorImage);
    console.log(predictions);
    const imageRecord: ImageType = {
      imagePath: imagePath,
      type: "bacterial",
      location: "unknown",
      time: Date.now(),
    }
    await addHistoryItem(db, imageRecord);
    setImage(initialImageState);
    router.replace("/history");
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.pickContainer} onPress={pickImage}>
        <Ionicons name="images-outline" color={Colors[colorScheme ?? "light"].icon} size={20} />
      </Pressable>
      {image.uri &&
        <>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <View style={styles.buttonGroup}>
            <Pressable style={styles.pickContainer} onPress={handleCancel}>
              <Ionicons name="close-outline" color={Colors[colorScheme ?? "light"].icon} size={20} />
            </Pressable>
            <Pressable style={styles.pickContainer} onPress={handleSubmit}>
              <Ionicons name="checkmark-outline" color={Colors[colorScheme ?? "light"].icon} size={20} />
            </Pressable>
          </View>
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 224,
    height: 224,
  },
  pickContainer: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: Colors.light.tint,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center",
    width: '100%',
  }
});
