
const Avatar = () => {

    const handleChoosePhoto = () => {
        launchImageLibrary({}, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.assets[0].uri;
                await uploadImage(source);
            }
        });
    };

}

export default Avatar;