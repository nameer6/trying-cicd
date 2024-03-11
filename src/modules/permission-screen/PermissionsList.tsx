import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {fonts} from 'src/common/fonts';
import CheckBox from './CheckBox';

const PERMISSIONS = [
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Know when you’ve been sent a reveal, comment, or reaction.',
    icon: (
      <Svg width="17" height="20" viewBox="0 0 17 20" fill="none">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.7501 4.93835C13.8857 2.98109 11.7665 1.20873 8.38596 0C4.96773 1.22692 2.82368 2.83767 1.9538 4.83226C1.47484 5.93048 1.40395 6.8943 1.34136 7.7451C1.33839 7.78552 1.33544 7.82569 1.33246 7.8656C1.33372 8.29108 1.33423 8.68889 1.33432 9.06721L1.33433 9.25479L1.33431 9.34743L1.33423 9.53055C1.33407 9.83548 1.33371 10.1291 1.33335 10.4162C1.33297 10.728 1.33259 11.0322 1.33249 11.3349L1.33246 11.5009C1.33246 12.699 0.888305 13.9347 0 15.208H8.38596L16.7039 15.185C15.8156 13.9276 15.3714 12.7073 15.3714 11.524C15.3714 11.1708 15.371 10.8171 15.3705 10.4527C15.3701 10.0948 15.3696 9.72672 15.3696 9.3388V9.14933C15.3696 8.76714 15.3701 8.36492 15.3714 7.93397C15.3685 7.89455 15.3655 7.85489 15.3625 7.81497C15.2999 6.97475 15.229 6.02291 14.7501 4.93835ZM5.46484 16.981H10.9017L10.8127 17.5573C10.6158 18.8328 9.514 19.8093 8.18326 19.8093C6.85253 19.8093 5.75077 18.8328 5.55382 17.5573L5.46484 16.981Z"
          fill="white"
        />
      </Svg>
    ),
    isChecked: false,
  },
  {
    id: 'contacts',
    name: 'Contacts',
    description:
      'Reveal requires your contacts to send your reveals and invite others to the app.',
    icon: (
      <Svg width="23" height="19" viewBox="0 0 23 19" fill="none">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M19.4775 4.2445C19.4775 6.31244 17.8009 7.989 15.7328 7.989C13.6648 7.989 11.9883 6.31244 11.9883 4.2445C11.9883 2.17637 13.6648 0.5 15.7328 0.5C17.8009 0.5 19.4775 2.17637 19.4775 4.2445ZM6.76013 9.489C8.82826 9.489 10.5046 7.81263 10.5046 5.7445C10.5046 3.67637 8.82826 2 6.76013 2C4.69219 2 3.01562 3.67637 3.01562 5.7445C3.01562 7.81263 4.69219 9.489 6.76013 9.489ZM0 18.9999C0.107022 14.5233 3.09302 10.9345 6.76416 10.9345C10.4349 10.9345 13.4213 14.5237 13.5283 18.9999H0ZM11.2422 11.2952C12.4362 9.9954 14.007 9.2062 15.7284 9.2062L15.7282 9.20605C19.3994 9.20605 22.3857 12.7952 22.4924 17.2714H15.1462C14.5806 14.6738 13.1437 12.5143 11.2422 11.2952Z"
          fill="white"
        />
      </Svg>
    ),
    isChecked: false,
  },
];

type Props = {
  navigation: any;
  selectedPermissions: string[];
  handlePermissionChange: (item: string) => void;
};

const PermissionsList = ({
  selectedPermissions,
  handlePermissionChange,
}: Props) => {
  const [permissions] = useState([...PERMISSIONS]);

  const onPermissionChange = (id: string) => () => {
    handlePermissionChange(id);
  };

  return (
    <View style={styles.container}>
      {permissions.map(item => (
        <TouchableOpacity
          style={styles.permissionItem}
          key={item.id}
          onPress={onPermissionChange(item.id)}>
          <View style={styles.iconStyle}>{item.icon}</View>
          <View style={styles.content}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <CheckBox
            isChecked={selectedPermissions.includes(item.id)}
            yellowOffset="0.7"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PermissionsList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.19)',
    paddingVertical: 20,
    gap: 20,
  },
  iconStyle: {
    width: 24,
  },
  content: {
    gap: 3,
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
  },
  description: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.5,
    maxWidth: '92%',
    fontFamily: fonts.SF_REGULAR,
  },
});
