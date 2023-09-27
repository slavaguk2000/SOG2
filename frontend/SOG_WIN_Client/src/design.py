from PyQt5 import QtCore, QtGui, QtWidgets
import config

class Ui_mainWindow(object):
    def setupUi(self, mainWindow):  
        mainWindow.setObjectName("mainWindow")
        mainWindow.resize(config.WIDTH, config.HEIGHT)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(mainWindow.sizePolicy().hasHeightForWidth())
        mainWindow.setSizePolicy(sizePolicy)
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap("res/folder.ico"), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        icon.addPixmap(QtGui.QPixmap("res/folder.ico"), QtGui.QIcon.Normal, QtGui.QIcon.On)
        mainWindow.setWindowIcon(icon)
        mainWindow.setStyleSheet("background-color: " + ("black" if config.isFull else "blue"))
        self.centralwidget = QtWidgets.QWidget(mainWindow)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.centralwidget.sizePolicy().hasHeightForWidth())
        self.centralwidget.setSizePolicy(sizePolicy)
        self.centralwidget.setMinimumSize(QtCore.QSize(config.WIDTH, config.HEIGHT))
        self.centralwidget.setMaximumSize(QtCore.QSize(config.WIDTH, config.HEIGHT))
        self.centralwidget.setObjectName("centralwidget")
        self.roll = QtWidgets.QLabel(self.centralwidget)
        self.roll.setGeometry(QtCore.QRect(0, config.yStart, config.MAX_WIDTH, config.MAX_HEIGHT))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Ignored, QtWidgets.QSizePolicy.Minimum)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.roll.sizePolicy().hasHeightForWidth())
        self.roll.setSizePolicy(sizePolicy)
        self.roll.setStyleSheet("background-color: rgba(0, 0, 0, 0)")
        self.roll.setText("")
        if not config.isFull: self.roll.setPixmap(QtGui.QPixmap("src/res/1.png"))
        self.roll.setScaledContents(True)
        self.roll.setObjectName("roll")
        self.mainText = QtWidgets.QLabel(self.centralwidget)
        self.mainText.setGeometry(QtCore.QRect(config.x0, config.yStart + config.y0, config.xSize, config.ySize - config.titleYSize))
        font = QtGui.QFont()
        font.setFamily("Arial")
        font.setPointSize(58)
        self.mainText.setFont(font)
        self.mainText.setStyleSheet("background-color: rgba(0, 0, 0, 0); color: rgba(0, 0, 0, 255)")
        self.mainText.setScaledContents(True)
        self.mainText.setAlignment(QtCore.Qt.AlignCenter)
        self.mainText.setWordWrap(True)
        self.mainText.setObjectName("mainText")
        self.script = QtWidgets.QLabel(self.centralwidget)
        self.script.setGeometry(QtCore.QRect(0, config.yStart, config.MAX_WIDTH, config.MAX_HEIGHT))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Ignored, QtWidgets.QSizePolicy.Minimum)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.script.sizePolicy().hasHeightForWidth())
        self.script.setSizePolicy(sizePolicy)
        self.script.setAutoFillBackground(False)
        self.script.setText("")
        if not config.isFull: self.script.setPixmap(QtGui.QPixmap("src/res/2.png"))
        self.script.setScaledContents(True)
        self.script.setObjectName("script")
        self.titleText = QtWidgets.QLabel(self.centralwidget)
        self.titleText.setGeometry(QtCore.QRect(config.x0, config.yStart + config.y0+config.ySize-config.titleYSize, config.xSize, config.titleYSize))
        font = QtGui.QFont()
        font.setFamily("Arial")
        font.setPointSize(24)
        self.titleText.setFont(font)
        self.titleText.setStyleSheet("background-color: rgba(0, 0, 0, 0); color: rgba(0, 0, 0, 255)")
        self.titleText.setScaledContents(True)
        self.titleText.setAlignment(QtCore.Qt.AlignCenter)
        self.titleText.setObjectName("titleText")
        self.script.raise_()
        self.roll.raise_()
        self.mainText.raise_()
        self.titleText.raise_()
        mainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(mainWindow)
        QtCore.QMetaObject.connectSlotsByName(mainWindow)
		

    def retranslateUi(self, mainWindow):
        _translate = QtCore.QCoreApplication.translate
        mainWindow.setWindowTitle(_translate("mainWindow", "SoG-client-" + ("full" if config.isFull else "roll") + "-horizontal"))
        self.mainText.setText(_translate("mainWindow", ""))
        self.titleText.setText(_translate("mainWindow", ""))
