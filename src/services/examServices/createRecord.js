exports.completeCase = async (req, res, next) => {
  try {
    const caseId = +req.params.caseId;
    const {
      patientId,
      inputData: { cc, pi, pe, diag, img, lab, detailDx, ad, fu },
    } = req.body;

    const picFiles = req.files;

    const waitCase = await getWaitingPt(patientId);

    //speacial for diag = [{diagName , diagTx : [{tx_title , tx_type , tx_detail},...]}]

    await updateData(
      CaseOrder,
      {
        status: "finish",
      },
      { where: { id: caseId } }
    );

    await updateData(
      ChiefComplaint,
      { title: cc.title },
      { where: { caseId } }
    );
    await updateData(
      PresentIll,
      { title: pi.title, piImg: pi.piImg || "" },
      { where: { caseId } }
    );
    if (checkExistRow(caseId, PhysicalExam)) {
      await updateData(
        PhysicalExam,
        {
          examManual: pe.examManual || "",
          examTemplate: pe.examTemplate || "",
          examImg: arrayToString(picFiles.pePic) || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(PhysicalExam, {
        examManual: pe.examManual || "",
        examTemplate: pe.examTemplate || "",
        examImg: arrayToString(picFiles.pePic) || "",
        caseId,
      });
    }
    if (checkExistRow(caseId, DetailDiag)) {
      await updateData(
        DetailDiag,
        {
          detail: detailDx.detail || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(DetailDiag, {
        detail: detailDx.detail || "",
        caseId,
      });
    }
    if (checkExistRow(caseId, Advice)) {
      await updateData(
        Advice,
        {
          detail: ad.detail || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(Advice, {
        detail: ad.detail || "",
        caseId,
      });
    }
    if (checkExistRow(caseId, FollowUp)) {
      await updateData(
        FollowUp,
        {
          fuHos: fu.fuHos || "",
          fuOPD: fu.fuOPD || "",
          fuDetail: fu.fuDetail || "",
          fuDate: fu.fuDate || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(FollowUp, {
        fuHos: fu.fuHos || "",
        fuOPD: fu.fuOPD || "",
        fuDetail: fu.fuDetail || "",
        fuDate: fu.fuDate || "",
        caseId,
      });
    }

    createDiagList(Diagnosis, Treatment, diag, caseId);
    createImgList(Imaging, img, picFiles.imgPic, caseId);
    createLabList(LabOrder, lab, picFiles.labPic, caseId);
    deleteRow(waitCase.id, WaitCase);

    res.status(201).json({ message: "create success" });
  } catch (err) {
    next(err);
  }
};
