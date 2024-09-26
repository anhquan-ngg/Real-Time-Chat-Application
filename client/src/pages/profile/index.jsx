import {useAppStore} from '@/store';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const {userInfo, setUserInfo} = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [hover, setHover] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);

    const saveChanges = async () => {};
    // pause here on 2:10:10

    return (
        <div>
            Profile
            <div>Email: {userInfo.email}</div>
        </div>
    );
}

export default Profile;