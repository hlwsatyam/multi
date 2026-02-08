import React from 'react';
import { Card, Avatar } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  HeartOutlined, 
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined 
} from '@ant-design/icons';

const DonationCard = ({ user }) => {
  return (
    <div className="w-[600px] h-[350px] bg-gradient-to-br from-blue-50 to-green-50 border-8 border-lifeline-gold rounded-3xl shadow-2xl p-8">
      <div className="flex h-full">
        {/* Left Section */}
        <div className="w-2/3 pr-8 border-r border-gray-300">
          <div className="flex items-start mb-6">
            <Avatar 
              src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : null}
              size={80}
              className="border-4 border-white shadow-lg"
            />
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-lifeline-blue">
                Lifeline Multi Technology
              </h1>
              <p className="text-gray-600">Official Donation Card</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <IdcardOutlined className="text-xl text-lifeline-blue mr-3" />
              <div>
                <div className="text-sm text-gray-600">Member ID</div>
                <div className="text-lg font-semibold">{user.username}</div>
              </div>
            </div>

            <div className="flex items-center">
              <HeartOutlined className="text-xl text-lifeline-green mr-3" />
              <div>
                <div className="text-sm text-gray-600">Member Since</div>
                <div className="text-lg font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <PhoneOutlined className="text-xl text-gray-600 mr-3" />
              <div className="text-lg">{user.mobile}</div>
            </div>

            <div className="flex items-center">
              <MailOutlined className="text-xl text-gray-600 mr-3" />
              <div className="text-lg">{user.email}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-1">Card Number</div>
            <div className="text-2xl font-bold text-lifeline-blue tracking-widest">
              LMT-{user.username.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 pl-8 flex flex-col items-center justify-between">
          <div className="text-center">
            <QRCodeCanvas
  value={JSON.stringify({
    memberId: user._id,
    username: user.username,
    cardNumber: `LMT-${user.username.toUpperCase()}`
  })}
  size={150}
  bgColor="#ffffff"
  fgColor="#000000"
  level="H"
  className="border-4 border-white rounded-lg shadow-lg"
/>
            <p className="text-xs text-gray-600 mt-2">Scan for verification</p>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Valid Through</div>
            <div className="text-lg font-bold">
              {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-600">
              This card certifies that the holder is an authorized donor
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;